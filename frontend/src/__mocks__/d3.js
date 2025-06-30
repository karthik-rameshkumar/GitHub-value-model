// Mock D3.js for tests
const mockD3 = {
  select: jest.fn(() => ({
    selectAll: jest.fn(() => ({
      remove: jest.fn()
    })),
    append: jest.fn(() => ({
      attr: jest.fn(() => ({
        attr: jest.fn()
      }))
    }))
  })),
  scaleTime: jest.fn(() => ({
    domain: jest.fn(() => ({
      range: jest.fn()
    }))
  })),
  scaleLinear: jest.fn(() => ({
    domain: jest.fn(() => ({
      nice: jest.fn(() => ({
        range: jest.fn()
      }))
    }))
  })),
  scaleBand: jest.fn(() => ({
    domain: jest.fn(() => ({
      range: jest.fn(() => ({
        padding: jest.fn()
      }))
    }))
  })),
  line: jest.fn(() => ({
    x: jest.fn(() => ({
      y: jest.fn(() => ({
        curve: jest.fn()
      }))
    }))
  })),
  arc: jest.fn(() => ({
    innerRadius: jest.fn(() => ({
      outerRadius: jest.fn(() => ({
        startAngle: jest.fn(() => ({
          endAngle: jest.fn()
        }))
      }))
    }))
  })),
  axisBottom: jest.fn(() => ({
    tickFormat: jest.fn()
  })),
  axisLeft: jest.fn(),
  axisRight: jest.fn(() => ({
    ticks: jest.fn()
  })),
  extent: jest.fn(() => [0, 100]),
  timeFormat: jest.fn(() => jest.fn()),
  curveMonotoneX: 'curveMonotoneX',
  color: jest.fn(() => ({
    rgb: jest.fn(() => ({ r: 255, g: 255, b: 255 }))
  }))
};

export default mockD3;