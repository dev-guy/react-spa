/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { JsonDecoder } from 'ts.data.json';

import Communicator, { Node, NodeType } from '.';

interface NodeKeys {
  company: string;
  cluster?: string;
  name: string;
  hostname: string;
  ip: string;
  'local ip': string;
  port: string;
}

const nodeKeysDecoder = JsonDecoder.object<NodeKeys>(
  {
    company: JsonDecoder.string,
    cluster: JsonDecoder.optional(JsonDecoder.string),
    name: JsonDecoder.string,
    hostname: JsonDecoder.string,
    ip: JsonDecoder.string,
    'local ip': JsonDecoder.string,
    port: JsonDecoder.string,
  },
  'NodeKeys',
);

class WebCommunicator extends Communicator {
  #url: string;

  #password: string;

  constructor(username: string, password: string, url: string) {
    super(username);
    this.#password = password;
    this.#url = url;
  }

  dehydrate(data: Record<string, unknown>): void {
    if (!data.type) data.type = 'WebCommunicator';
    data.password = this.#password;
    data.url = this.#url;
    super.dehydrate(data);
  }

  get url(): string {
    return this.#url;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forward(headers: Record<string, string>): string {
    return this.#url;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  login(): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  logout(): void {
    // TODO
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getArray(headers: Record<string, string>): Promise<Record<string, any>[]> {
    const url = this.forward(headers);
    const response = await fetch(url, { headers });
    if (response.status !== 200) throw new Error(`Error ${response.status.toString()}`);
    const result = JSON.parse((await response.text()).replace(/'/g, '"'));
    if (!Array.isArray(result)) throw new Error('Return value is not an array');
    return result;
  }

  private async nodesWithType(type: NodeType): Promise<Node[]> {
    const data = await this.getArray({
      type: 'info',
      details: `blockchain get ${type}`,
    });

    const results: Node[] = [];

    for await (let item of data) {
      item = item[type];
      if (!item) throw new Error(`Nodes item is missing expected type ${type}`);
      const nodeKeys = await nodeKeysDecoder.decodePromise(item);
      const copy = { ...nodeKeys, port: Number(nodeKeys.port) };
      results.push({ type, ...copy });
    }

    return results;
  }

  async nodes(): Promise<Node[]> {
    const promises = [NodeType.operator, NodeType.publisher, NodeType.query].map((type) => this.nodesWithType(type)); // :Promise<Node[]>[] =

    const allData: Node[] = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < promises.length; ++i) {
      // eslint-disable-next-line no-await-in-loop
      allData.push(...(await promises[i]));
    }
    return allData;
  }
}

export default WebCommunicator;
