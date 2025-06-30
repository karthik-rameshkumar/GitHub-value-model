module.exports = {
  graphql: jest.fn().mockResolvedValue({ data: {} }),
  defaults: jest.fn().mockReturnValue(jest.fn().mockResolvedValue({ data: {} }))
};