/** biome-ignore-all lint/style/useNamingConvention: naming from mailpit */
export type MailpitAddress = {
  Name: string;
  Address: string;
};

export type MailpitMessageSummary = {
  ID: string;
  Subject: string;
  From: MailpitAddress;
  To: MailpitAddress[];
  Created: string;
};

export type MailpitMessagesResponse = {
  messages: MailpitMessageSummary[];
  total: number;
  count: number;
  start: number;
};

export type MailpitMessage = {
  ID: string;
  Subject: string;

  HTML?: string;
  Text?: string;

  From: {
    Name: string;
    Address: string;
  };

  To: Array<{
    Name: string;
    Address: string;
  }>;
};
