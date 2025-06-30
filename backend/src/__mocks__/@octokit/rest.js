module.exports = {
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      meta: {
        get: jest.fn().mockResolvedValue({ data: {} })
      },
      repos: {
        get: jest.fn().mockResolvedValue({ data: {} }),
        listForOrg: jest.fn().mockResolvedValue({ data: [] }),
        listForAuthenticatedUser: jest.fn().mockResolvedValue({ data: [] }),
        listDeployments: jest.fn().mockResolvedValue({ data: [] }),
        listLanguages: jest.fn().mockResolvedValue({ data: {} }),
        getAllTopics: jest.fn().mockResolvedValue({ data: { names: [] } }),
        listContributors: jest.fn().mockResolvedValue({ data: [] }),
        getCodeFrequencyStats: jest.fn().mockResolvedValue({ data: [] }),
        getParticipationStats: jest.fn().mockResolvedValue({ data: {} }),
        getCommitActivityStats: jest.fn().mockResolvedValue({ data: [] }),
        listDeploymentStatuses: jest.fn().mockResolvedValue({ data: [] }),
      },
      pulls: {
        list: jest.fn().mockResolvedValue({ data: [] }),
        get: jest.fn().mockResolvedValue({ data: {} }),
        listReviewComments: jest.fn().mockResolvedValue({ data: [] }),
        listReviews: jest.fn().mockResolvedValue({ data: [] }),
        listCommits: jest.fn().mockResolvedValue({ data: [] }),
      },
      search: {
        repos: jest.fn().mockResolvedValue({ data: { items: [], total_count: 0 } }),
      },
      users: {
        getAuthenticated: jest.fn().mockResolvedValue({ data: { login: 'test', type: 'User' } })
      }
    },
    request: jest.fn().mockResolvedValue({ data: [] })
  }))
};