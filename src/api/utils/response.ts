export function success<T extends any>(data: any = null, msg = 'ok'): T {
  return {
    data,
    code: 0,
    msg,
  } as T;
}

export function error(msg: string, code = -1) {
  return {
    code,
    msg,
    data: null,
  };
}

export function successPage(list, size, page, total) {
  return success({ list, size, page, total });
}
