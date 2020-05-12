export const responseHandler = async (res: Partial<Response>) => {
  let resp;
  try {
    resp = await res.json();
  } catch {
    return this;
  }
  if (!res.ok) {
    throw new Error(resp.message);
  }
  return resp;
};
