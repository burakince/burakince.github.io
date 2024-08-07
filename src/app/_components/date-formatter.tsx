import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString || "1970-01-01T00:00:00.000Z");
  return (
    <time
      className="text-sm text-slate-500 dark:text-slate-400"
      dateTime={dateString}
    >
      {format(date, "LLLL	d, yyyy")}
    </time>
  );
};

export default DateFormatter;
