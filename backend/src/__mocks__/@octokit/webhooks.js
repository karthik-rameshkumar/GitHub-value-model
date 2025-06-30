module.exports = {
  Webhooks: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    onError: jest.fn(),
    receive: jest.fn()
  })),
  createNodeMiddleware: jest.fn().mockReturnValue((req, res, next) => next())
};