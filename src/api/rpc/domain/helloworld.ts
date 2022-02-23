/**
* This file is auto-generated by grpc-helper
*/

/* eslint-disable @typescript-eslint/no-namespace */

import * as grpc from '@midwayjs/grpc';

/* package helloworld start */
export namespace helloworld {
  export interface Greeter {
    // Sends a greeting
    sayHello(data: HelloRequest): Promise<HelloReply>;
  }
  /**
   * Greeter client interface
   */
  export interface GreeterClient {
    // Sends a greeting
    sayHello(options?: grpc.IClientOptions): grpc.IClientUnaryService<HelloRequest, HelloReply>;
  }
  export interface HelloRequest {
    name?: string;
  }
  export interface HelloReply {
    message?: string;
  }
}
/* package helloworld end */
