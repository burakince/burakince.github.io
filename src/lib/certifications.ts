export type Certificate = {
  name: string;
  url: string;
  type: "specialization" | "course";
  issuer: string;
  issuerUrl: string;
};

export const CERTIFICATES: readonly Certificate[] = [
  // Specializations
  {
    name: "Preparing for Google Cloud Certification: Cloud Data Engineering",
    url: "https://www.coursera.org/account/accomplishments/specialization/RVR24V6CXGWC",
    type: "specialization",
    issuer: "Google Cloud",
    issuerUrl: "https://cloud.google.com",
  },
  {
    name: "Deep Learning",
    url: "https://www.coursera.org/account/accomplishments/specialization/62EWNC4TGZLB",
    type: "specialization",
    issuer: "DeepLearning.AI",
    issuerUrl: "https://www.deeplearning.ai",
  },
  // Courses — Google Cloud (newest to oldest)
  {
    name: "Preparing for your Professional Data Engineer Journey",
    url: "https://www.coursera.org/account/accomplishments/certificate/P7BA8ENUFAQW",
    type: "course",
    issuer: "Google Cloud",
    issuerUrl: "https://cloud.google.com",
  },
  {
    name: "Smart Analytics, Machine Learning, and AI on Google Cloud",
    url: "https://www.coursera.org/account/accomplishments/certificate/YYVGV9KLJ4GE",
    type: "course",
    issuer: "Google Cloud",
    issuerUrl: "https://cloud.google.com",
  },
  {
    name: "Build Streaming Data Pipelines on Google Cloud",
    url: "https://www.coursera.org/account/accomplishments/certificate/ZFU8PM8ZQ593",
    type: "course",
    issuer: "Google Cloud",
    issuerUrl: "https://cloud.google.com",
  },
  {
    name: "Build Batch Data Pipelines on Google Cloud",
    url: "https://www.coursera.org/account/accomplishments/certificate/LQUSYXTLVZYN",
    type: "course",
    issuer: "Google Cloud",
    issuerUrl: "https://cloud.google.com",
  },
  {
    name: "Build Data Lakes and Data Warehouses on Google Cloud",
    url: "https://www.coursera.org/account/accomplishments/certificate/7N66JRZ6L98P",
    type: "course",
    issuer: "Google Cloud",
    issuerUrl: "https://cloud.google.com",
  },
  {
    name: "Google Cloud Big Data and Machine Learning Fundamentals",
    url: "https://www.coursera.org/account/accomplishments/verify/L7EQCS6C3YJ8",
    type: "course",
    issuer: "Google Cloud",
    issuerUrl: "https://cloud.google.com",
  },
  // Courses — DeepLearning.AI (newest to oldest)
  {
    name: "Sequence Models",
    url: "https://www.coursera.org/account/accomplishments/verify/SZ2FY4JQHJTY",
    type: "course",
    issuer: "DeepLearning.AI",
    issuerUrl: "https://www.deeplearning.ai",
  },
  {
    name: "Convolutional Neural Networks",
    url: "https://www.coursera.org/account/accomplishments/verify/VRDLTWSSNTVN",
    type: "course",
    issuer: "DeepLearning.AI",
    issuerUrl: "https://www.deeplearning.ai",
  },
  {
    name: "Structuring Machine Learning Projects",
    url: "https://www.coursera.org/account/accomplishments/verify/2KTQPMC5ZQ5P",
    type: "course",
    issuer: "DeepLearning.AI",
    issuerUrl: "https://www.deeplearning.ai",
  },
  {
    name: "Improving Deep Neural Networks: Hyperparameter Tuning, Regularization and Optimization",
    url: "https://www.coursera.org/account/accomplishments/verify/6X9BJQFAA8TU",
    type: "course",
    issuer: "DeepLearning.AI",
    issuerUrl: "https://www.deeplearning.ai",
  },
  {
    name: "Neural Networks and Deep Learning",
    url: "https://www.coursera.org/account/accomplishments/verify/BTGHNHJZH9KV",
    type: "course",
    issuer: "DeepLearning.AI",
    issuerUrl: "https://www.deeplearning.ai",
  },
  // Courses — Johns Hopkins University (newest to oldest)
  {
    name: "Single Page Web Applications with AngularJS",
    url: "https://www.coursera.org/account/accomplishments/verify/4Q246J4BXS4T",
    type: "course",
    issuer: "Johns Hopkins University",
    issuerUrl: "https://www.jhu.edu",
  },
  {
    name: "Ruby on Rails Web Services and Integration with MongoDB",
    url: "https://www.coursera.org/account/accomplishments/verify/UZTYJQ5MDVQQ",
    type: "course",
    issuer: "Johns Hopkins University",
    issuerUrl: "https://www.jhu.edu",
  },
  {
    name: "HTML, CSS, and Javascript for Web Developers",
    url: "https://www.coursera.org/account/accomplishments/verify/A7ZUJ8L445PA",
    type: "course",
    issuer: "Johns Hopkins University",
    issuerUrl: "https://www.jhu.edu",
  },
  {
    name: "Rails with Active Record and Action Pack",
    url: "https://www.coursera.org/account/accomplishments/verify/GBDMFRWAM68B",
    type: "course",
    issuer: "Johns Hopkins University",
    issuerUrl: "https://www.jhu.edu",
  },
  {
    name: "Ruby on Rails: An Introduction",
    url: "https://www.coursera.org/account/accomplishments/verify/4Y899D8A9AKW",
    type: "course",
    issuer: "Johns Hopkins University",
    issuerUrl: "https://www.jhu.edu",
  },
  // Courses — CentraleSupélec
  {
    name: "Build Your First Android App (Project-Centered Course)",
    url: "https://www.coursera.org/account/accomplishments/verify/DJEKWZBCUZ68",
    type: "course",
    issuer: "CentraleSupélec",
    issuerUrl: "https://www.centralesupelec.fr",
  },
  // Courses — Udemy (newest to oldest)
  {
    name: "Istio Hands-On for Kubernetes",
    url: "https://www.udemy.com/certificate/UC-6d4a81a0-72f5-483c-8bfa-948a0fc0c9f7/",
    type: "course",
    issuer: "Udemy",
    issuerUrl: "https://www.udemy.com",
  },
  {
    name: "Complete Guide to Protocol Buffers 3 [Java, Golang, Python]",
    url: "https://www.udemy.com/certificate/UC-a3a1af09-0101-4023-9d62-c86b695af912/",
    type: "course",
    issuer: "Udemy",
    issuerUrl: "https://www.udemy.com",
  },
  {
    name: "The Complete Traefik Training Course",
    url: "https://www.udemy.com/certificate/UC-9cce3091-ead4-4264-acee-0a7a9cf1722c/",
    type: "course",
    issuer: "Udemy",
    issuerUrl: "https://www.udemy.com",
  },
];
