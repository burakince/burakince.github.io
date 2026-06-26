---
title: "I Built a Local AI Commit Message Generator with Go and Ollama"
excerpt: "I built git-aimit: a Go CLI that generates Conventional Commits messages from your staged diff using a local Ollama model. No cloud endpoint, no API key."
date: "2026-06-22T02:00:00.000Z"
lastModified: "2026-06-26T00:32:58.000Z"
tags:
  - go
  - git
  - ai
  - llm
  - ollama
  - cli
  - devtools
  - conventional-commits
---

I built this because I am too lazy to write commit messages. Not the "I know I should but I don't" kind of lazy. More the "the diff is already there, the computer can clearly see what changed, why am I the one narrating it?" kind. And when I do try, it turns out to be harder than it looks. Picking the right [Conventional Commits](https://www.conventionalcommits.org/) type, scope, and a subject that says _why_ rather than just _what_ is a real cognitive task. It interrupts flow at exactly the wrong moment.

[`git-aimit`](https://github.com/burakince/git-aimit) is what I built. It reads your staged diff and proposes a Conventional Commits message using a [locally running Ollama](https://ollama.com/) model. No API key, no cloud endpoint. The diff never leaves your machine. You review the proposal and confirm before anything is committed. The binary integrates with Git via the `git-*` naming convention, so once it is on your `PATH` as `git-aimit`, Git exposes it as `git aimit` alongside your existing commands.

Run `git aimit` after staging your changes:

```text
Generating commit message using ollama (llama3.1)...

Generated commit message:

feat(auth): add JWT expiry validation

Prevents tokens with expired `exp` claims from being accepted by the
middleware, closing a gap where long-lived tokens remained valid after
the configured TTL had passed.

Commit with this message? [y/N]: y
Committed successfully.
```

## How it works

The module lives at `github.com/burakince/git-aimit` and targets Go 1.21+. I kept the dependency count deliberately low: [Cobra](https://github.com/spf13/cobra) for CLI structure, [Viper](https://github.com/spf13/viper) for config reading. That is the entire external surface. CGO is disabled throughout, which makes cross-compilation trivial and removes the C toolchain requirement from every build environment.

```text
cmd/root.go                 — load config → optional auto-stage → diff → generate → confirm → commit
cmd/init.go                 — interactive setup wizard
internal/config/            — Config struct; schema versioning; JSON + mapstructure tags; explicit path I/O
internal/config/assets/     — embedded commit-template.txt written to ~/.config/git-aimit/ on init
internal/git/               — IsRepo(), StagedDiff(), StageAll(), Commit()
internal/llm/               — Provider interface
internal/llm/ollama/        — Ollama HTTP client + BuildPrompt()
evals/                      — opt-in model quality tests (build tag: evals)
```

The config file lives at `~/.config/git-aimit/config.json` (mode `0600`):

```json
{
  "config_version": 1,
  "provider": "ollama",
  "auto_stage": false,
  "commit_template": "~/.config/git-aimit/commit-template.txt",
  "ollama": {
    "base_url": "http://localhost:11434",
    "model": "llama3.1"
  }
}
```

The `config_version` field lets the tool detect when your config was written by an older version of init. If it is out of date, you get a warning telling you to re-run `git aimit init` rather than a confusing failure. `git aimit --version` is also wired via ldflags at release time, which somehow did not exist until now.

The model you pick matters. `llama3.1` is a reasonable default for everyday commits, but local models have context windows. A large staged diff, say a multi-file refactor spanning several thousand lines, can exceed what a smaller model handles well and the output degrades noticeably. For those cases, a model with a larger context window and stronger coding ability works better. Run `ollama list` to see what you have pulled locally and swap the `model` value in the config. If you are regularly committing large changesets, consider pulling `codellama` or a quantised version of `llama3.1:8b` before relying on the tool for those commits.

The `auto_stage` flag is set during `git aimit init` and causes the tool to run `git add -A` before diffing. It is off by default, because silently staging unintended files is a worse mistake than forgetting to stage something. To enable it after the initial setup, open `~/.config/git-aimit/config.json` and set `"auto_stage": true` directly. The `init` command validates connectivity before saving: it sends a test request to Ollama, and if the model is not available it prints the error and exits without writing the config file.

## Why run the model locally?

A staged diff is not just code. It can contain API keys accidentally added before `.gitignore` catches them, internal domain logic, unreleased feature names, or proprietary business rules. Sending that to a cloud LLM endpoint (GitHub Copilot, ChatGPT, whatever) means it gets processed on a third-party server, potentially logged and retained under that provider's data policy.

Ollama runs the model entirely on your machine. By default, the HTTP call goes to `localhost:11434` and nothing crosses a network boundary. Locality is the core design constraint. Ollama is currently the most accessible way to satisfy it. If you point `base_url` at a remote GPU box, diffs travel over that network. Worth knowing before you do it.

## The Provider interface

The first architectural decision: `cmd/root.go` holds an `llm.Provider` interface variable, not a concrete `*ollama.Client`.

```go
type Provider interface {
    GenerateCommitMessage(ctx context.Context, diff string) (string, error)
}
```

Adding a new backend (OpenAI, Anthropic, a local llama.cpp HTTP server) requires a new package under `internal/llm/<name>/`, an implementation of this single method, and a new `case` in the `switch cfg.Provider` block in `root.go`. No other files change. I am not predicting the future here; I am just not closing doors I do not need to close. The interface also makes testing easy: any `httptest.NewServer` that speaks the right protocol can substitute for a real Ollama instance.

## The system prompt was the hard part

The first version of the system prompt said:

```text
You are an expert Git commit message writer. Write a concise Conventional Commits
message for the staged changes below. Format: <type>(<scope>): <subject>
Optional body: explain WHY, not WHAT.
```

The word "optional" was fatal. The model read that as permission to stop after the subject line regardless of diff complexity. Every output was a single line. A three-file change touching the config schema, the Ollama client, and the init command came back as:

```text
feat(config): add auto_stage option
```

Which is not wrong, but it is not useful either. It tells me nothing about why three subsystems changed at once.

The rewrite made the body required when any of these apply:

1. The diff touches more than one bounded context, package, or architectural layer
2. The motivation behind the change is not obvious from the diff alone
3. Multiple distinct concerns are addressed in the same staged set

I also changed the user prompt to prime the model with explicit analysis before writing:

```text
Analyse the following staged diff. Identify how many bounded contexts or packages
are affected, then write the commit message.
```

This forces the model to do the complexity analysis first rather than defaulting to brevity. The order matters: if you ask a model to "write X, then check Y", it usually skips the check. Asking it to "check Y, then write X" actually works.

The `BuildPrompt` function is exported from `internal/llm/ollama` as a pure function: it takes the staged diff and any commit template content and returns the user prompt string. This makes it testable without a network. I also added a lightweight regression guard:

```go
func TestSystemPromptRequiresBody(t *testing.T) {
    for _, phrase := range []string{"bounded context", "WHY", "motivation", "required"} {
        if !strings.Contains(SystemPrompt, phrase) {
            t.Errorf("system prompt missing required phrase: %q", phrase)
        }
    }
}
```

It is a blunt instrument, but it has caught one accidental regression already during a refactor where I consolidated some prompt text and dropped "motivation" without noticing.

The prompt went through another round of work that surfaced a subtler problem: content files. When you add a blog post about building software, the model reads the post body and comes back with something like `feat: implement authentication middleware`, because that is what the content describes. That is not what the commit does. The commit adds a post _about_ implementing authentication middleware. Those are not the same thing.

The fix is to classify each changed file before writing anything. For paths under `_posts/`, `docs/`, `articles/`, or similar content directories, the model derives the subject from the filename slug and stops. It does not open the file. `_posts/2024-03-10-understanding-linux-memory-management.md` becomes `docs: add post on understanding Linux memory management`. The classification step runs first because once a model starts reading file content, it anchors on that.

Two things helped reliability across smaller models: structured inputs and examples. The user prompt now wraps data in XML-tagged blocks (`<changed_files>`, `<staged_diff>`, and optionally `<commit_template>`), which separates data from instructions more cleanly than inline text. The system prompt also includes four Input/Output examples covering the common patterns. Smaller models benefit from seeing the expected format before producing it; instructions alone are not always enough.

## Cleaner output, automatically

The prompt tells the model to output nothing but the commit message. Most of the time that works. Sometimes it does not: a preamble ("Here is your commit message:"), a code fence wrapping the output, or a closing note ("Note that this message follows Conventional Commits format"). Each is harmless in isolation but annoying at the moment you are about to confirm a commit.

Three post-processing functions now run on every response before it is displayed. The first strips any lines before the first valid Conventional Commits prefix (the model's introduction, if it added one). The second removes code fence markers. The third drops trailing paragraphs that look like model self-explanation based on their opening words.

When the model behaves, none of these fire. When it does not, the noise is gone before you see it.

## Commit template support

If your repo has a commit message template (set via `git config commit.template`), the tool reads it and passes it to the model. The model follows whatever format is already in use rather than falling back to its own style.

For repos with no template, `git aimit init` writes a built-in one to `~/.config/git-aimit/commit-template.txt`:

```text
{type}({scope}): {subject}

{Explain WHY this change was made — the motivation, constraint, or trade-off.
Include a body when multiple packages are affected or the motivation is
non-obvious. Separate from subject with a blank line. Wrap at 72 chars.}
```

The template path is stored in the config, so switching formats for a different project means updating one field.

## Streaming with Ollama's NDJSON API

Ollama's `/api/generate` endpoint streams responses as newline-delimited JSON. Each line is a partial response object:

```json
{"response":"feat","done":false}
{"response":"(config)","done":false}
{"response":": add auto_stage","done":false}
{"response":"","done":true}
```

Streaming matters here because commit message generation on a local model can take several seconds, and a blank terminal for that long feels broken. With streaming, characters appear as the model produces them, so you can tell it is working.

The implementation uses a `bufio.Scanner` over the response body:

```go
scanner := bufio.NewScanner(resp.Body)
var sb strings.Builder
for scanner.Scan() {
    var chunk generateResponse
    if err := json.Unmarshal(scanner.Bytes(), &chunk); err != nil {
        continue
    }
    sb.WriteString(chunk.Response)
    if chunk.Done {
        break
    }
}
return strings.TrimSpace(sb.String()), scanner.Err()
```

The tool passes the accumulated string through the post-processing pipeline before displaying it, so you only ever see the cleaned result.

The error handling took a second pass. The first version checked the HTTP status code and returned a generic message on non-200. That produced unhelpful errors like `ollama request failed: 404`. The actual Ollama error response body on a 404 is:

```json
{ "error": "model 'llama3.1' not found, try pulling it first" }
```

The rewrite reads the body on error and passes that message through. A missing model now tells the user exactly what to do:

```text
model 'llama3.1' not found, try pulling it first -- try: ollama pull <model>
```

## Testing without a running Ollama instance

All HTTP tests use `net/http/httptest.NewServer`. No mocking libraries, just a handler function that returns the fixture response the test needs.

```go
func TestStreamingResponse(t *testing.T) {
    srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        lines := []string{
            `{"response":"feat(config): add auto_stage\n","done":false}`,
            `{"response":"","done":true}`,
        }
        for _, line := range lines {
            fmt.Fprintln(w, line)
        }
    }))
    defer srv.Close()

    client := ollama.NewClient(srv.URL, "test-model")
    msg, err := client.GenerateCommitMessage(context.Background(), "diff --git a/...")
    // assertions ...
}
```

The `internal/config` tests are similarly self-contained. `LoadFrom` and `SaveTo` take explicit file paths rather than reading from `~/.config` directly, so tests write to `t.TempDir()` and never touch the filesystem outside the test run. The round-trip test also asserts the saved file has mode `0600`, a requirement I added after realising the first version called `os.WriteFile` with `0644` and exposed the config (which could include future API keys) to all users on a shared machine.

## Evals: testing model quality

Unit tests verify that the code behaves correctly. They say nothing about whether the model output is actually useful. For that I added an `evals/` directory behind a `//go:build evals` tag:

```bash
go test -tags evals -v ./evals/
```

This is completely excluded from `go test ./...`, so CI runs fast and the evals remain optional. They require a live Ollama instance and skip automatically if the endpoint is unreachable: the test calls Ollama at startup and calls `t.Skip()` on connection failure.

A `criterion` is just a named predicate:

```go
type criterion struct {
    name  string
    check func(msg string) bool
}
```

Two fixture diffs exercise the two cases I care about:

- `simpleDiff`: a single-file, single-concern change. Criteria: valid Conventional Commits format, subject line under 72 characters, no markdown code fences in the output.
- `complexDiff`: three files across config, Ollama client, and init command. Same format criteria, plus an assertion that a body paragraph is present.

```go
var complexCriteria = []criterion{
    {name: "conventional commits format", check: isConventionalCommit},
    {name: "subject under 72 chars",      check: subjectUnder72},
    {name: "no code fences",              check: noCodeFences},
    {name: "body present for complex diff", check: hasBody},
}
```

The endpoint and model are overridable via environment variables:

```bash
OLLAMA_BASE_URL=http://gpu-box:11434 OLLAMA_MODEL=mistral go test -tags evals -v ./evals/
```

Nailing down exact phrasing, specific scope values, or exact line counts as criteria sounds rigorous, but it just creates tests that break when the model version changes and tell you nothing about real quality regression. What you actually want to know: does the output follow the format, is the subject short enough, does a complex diff get a body? Everything else is the model's call.

## CI/CD and cross-compilation

`ci.yml` runs `go vet` and `go test ./...` on every push and PR to `main`. Nothing fancy.

The release workflow triggers on `v*` tags and builds six binaries (Linux, macOS, Windows; amd64 and arm64) from a single `ubuntu-latest` runner with `CGO_ENABLED=0`. Build flags: `-trimpath -ldflags="-s -w"`. The `-trimpath` flag strips local file paths from the binary; `-s -w` drops the symbol table and debug info. Together they reduce binary size by roughly 30% and avoid embedding my laptop's directory layout in a public release.

One thing did bite me early: `actions/setup-go` has a built-in Go module cache restore step. On one of the initial runs it failed with `"tar exit code 2"` during cache restoration. The error message gives you nothing useful. It is a corrupted cache entry in GitHub's Actions cache store. The fix is `cache: false` on the setup step. The cache is a nice-to-have; the build does not need it, and it kept coming back at random, so I just turned the cache off.

The workflow publishes binaries as GitHub release assets via `softprops/action-gh-release`. After the release, an `update-homebrew` job patches the SHA256 values in `Formula/git-aimit.rb` and commits back to `main` automatically. No manual formula maintenance needed.

## The Homebrew formula

The formula lives in `Formula/git-aimit.rb` in the same repository, making the repo its own tap. Non-standard, but workable with an explicit URL:

```bash
brew tap burakince/git-aimit https://github.com/burakince/git-aimit
brew install git-aimit
```

Homebrew prompts you to review the tap URL when you add a third-party tap, since formulas can run arbitrary shell commands. That confirmation happens during `brew tap` itself.

It downloads pre-built binaries from the GitHub release, using Homebrew's `on_macos`/`on_linux` and `on_arm`/`on_intel` blocks to select the right asset per platform:

```ruby
on_macos do
  on_arm do
    url "https://github.com/burakince/git-aimit/releases/download/v0.0.4/git-aimit-darwin-arm64"
    sha256 "6ddab81ad8dc1f40d2ec70f819f5f0844ce57d2573604f33e9264f52aa68c286"
  end
  on_intel do
    url "https://github.com/burakince/git-aimit/releases/download/v0.0.4/git-aimit-darwin-amd64"
    sha256 "5743de3e6036976295d78db46f67c82bad4c9174c6352c1df8122e599d2c4190"
  end
end

on_linux do
  on_arm do
    url "https://github.com/burakince/git-aimit/releases/download/v0.0.4/git-aimit-linux-arm64"
    sha256 "083f5c15a4c78dd465c8568cba6c1eb48e9aaf626890b4393ccb1769857fda61"
  end
  on_intel do
    url "https://github.com/burakince/git-aimit/releases/download/v0.0.4/git-aimit-linux-amd64"
    sha256 "67e710a2815d73a58c943cb31ec3abcf03f8d82c76c11a1e1e9d932cf4c5aaf5"
  end
end
```

The `install` step just renames the downloaded file and drops it into Homebrew's bin directory:

```ruby
def install
  os   = OS.mac? ? "darwin" : "linux"
  arch = Hardware::CPU.arm? ? "arm64" : "amd64"
  bin.install "git-aimit-#{os}-#{arch}" => "git-aimit"
end
```

You don't need Go on your machine. There's nothing to compile, so install takes a few seconds. The formula also includes a `caveats` block that prompts users to run `git aimit init` after installation. Without that step there is no config file and every subsequent `git aimit` call fails immediately.

Those values are for v0.0.4. The release workflow patches them automatically on each new tag, so the formula in the repo always reflects the current version.

## Try it now

On macOS or Linux:

```bash
brew tap burakince/git-aimit https://github.com/burakince/git-aimit
brew install git-aimit
git aimit init   # one-time interactive setup
```

On Windows (amd64 and arm64):

```powershell
scoop bucket add git-aimit https://github.com/burakince/git-aimit
scoop install git-aimit
git aimit init   # one-time interactive setup — works in PowerShell and CMD
```

After `init` on any platform, stage your changes and run `git aimit`. That is the entire workflow.

## What is next

The `Provider` interface makes adding new backends a small lift. OpenAI's chat completions API follows the same streaming pattern. Anthropic's Messages API is slightly different but close enough. The only change in `root.go` would be a new case in the provider switch, which matters for situations where local hardware is not an option.

Right now the flow is: stream, confirm, commit or abort. That works, but it is all-or-nothing. A lightweight TUI that lets you edit the proposed message before confirming would make the generated output a first draft rather than a take-it-or-leave-it proposal.

The eval framework is minimal by design and should stay that way until there is a clear pattern of regressions that criteria-based checks would have caught. What I want to add is a wider fixture set covering renamed files, binary file changes, and merge conflict markers, plus a way to run evals against multiple models in one pass to compare output quality.

I still write bad commit messages sometimes. The difference is now I have to actively choose to skip `git aimit`, which makes it harder to be lazy by accident. That is probably the more honest measure of success than any output quality metric.

The source is at [github.com/burakince/git-aimit](https://github.com/burakince/git-aimit).
