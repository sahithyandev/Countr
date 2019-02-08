export namespace SMTP {
  const DEFAULT_TIMEOUT: number;
  class SMTP {
    static defaultMaxListeners: any;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
    constructor({
      timeout,
      host,
      user,
      password,
      domain,
      port,
      ssl,
      tls,
      authentication,
    }: any);
    sock: any;
    features: any;
    monitor: any;
    authentication: any;
    timeout: any;
    domain: any;
    host: any;
    ssl: any;
    tls: any;
    port: any;
    loggedin: any;
    user: any;
    password: any;
    addListener(type: any, listener: any): any;
    authorized(): any;
    close(force: any): void;
    command(cmd: any, callback: any, codes: any): void;
    connect(callback: any, port: any, host: any, options: any): void;
    data(callback: any): void;
    data_end(callback: any): void;
    debug(level: any): void;
    ehlo(callback: any, domain: any): void;
    ehlo_or_helo_if_needed(callback: any, domain: any): void;
    emit(type: any, ...args: any[]): any;
    eventNames(): any;
    expn(address: any, callback: any): void;
    getMaxListeners(): any;
    has_extn(opt: any): any;
    helo(callback: any, domain: any): void;
    help(callback: any, domain: any): void;
    listenerCount(type: any): any;
    listeners(type: any): any;
    login(callback: any, user: any, password: any, options: any): void;
    mail(callback: any, from: any): void;
    message(data: any): void;
    noop(callback: any): void;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    parse_smtp_features(data: any): void;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    quit(callback: any): void;
    rcpt(callback: any, to: any): void;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    rset(callback: any): void;
    send(str: any, callback: any): void;
    setMaxListeners(n: any): any;
    starttls(callback: any): void;
    state(): any;
    verify(address: any, callback: any): void;
  }
  namespace SMTP {
    class EventEmitter {
      // Circular reference from email.SMTP.SMTP.EventEmitter
      static EventEmitter: any;
      static defaultMaxListeners: any;
      static init(): void;
      static listenerCount(emitter: any, type: any): any;
      static usingDomains: boolean;
      addListener(type: any, listener: any): any;
      emit(type: any, ...args: any[]): any;
      eventNames(): any;
      getMaxListeners(): any;
      listenerCount(type: any): any;
      listeners(type: any): any;
      on(type: any, listener: any): any;
      once(type: any, listener: any): any;
      prependListener(type: any, listener: any): any;
      prependOnceListener(type: any, listener: any): any;
      removeAllListeners(type: any, ...args: any[]): any;
      removeListener(type: any, listener: any): any;
      setMaxListeners(n: any): any;
    }
  }
  const authentication: {
    CRAM_MD5: string;
    LOGIN: string;
    PLAIN: string;
    XOAUTH2: string;
  };
  const state: {
    CONNECTED: number;
    CONNECTING: number;
    NOTCONNECTED: number;
  };
}
export namespace date {
  function getRFC2822Date(date: any, useUtc: any): any;
  function getRFC2822DateUTC(date: any): any;
}
export function error(message: any, code: any, error: any, smtp: any): any;
export namespace error {
  const AUTHFAILED: number;
  const AUTHNOTSUPPORTED: number;
  const BADRESPONSE: number;
  const CONNECTIONAUTH: number;
  const CONNECTIONCLOSED: number;
  const CONNECTIONENDED: number;
  const COULDNOTCONNECT: number;
  const ERROR: number;
  const NOCONNECTION: number;
  const TIMEDOUT: number;
}
export namespace message {
  const BUFFERSIZE: number;
  class Message {
    constructor(headers: any);
    attachments: any;
    alternative: any;
    header: any;
    content: any;
    text: any;
    attach(options: any, ...args: any[]): any;
    attach_alternative(html: any, charset: any): any;
    read(callback: any): void;
    stream(): any;
    valid(callback: any): void;
  }
  function create(headers: any): void;
}
export namespace server {
  class Client {
    constructor(server: any);
    smtp: any;
    queue: any;
    timer: any;
    sending: any;
    ready: any;
    send(msg: any, callback: any): void;
  }
  function connect(server: any): void;
}
