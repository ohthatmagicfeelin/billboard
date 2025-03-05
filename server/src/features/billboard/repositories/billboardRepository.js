import prisma from '../../../db/client.js';
import { AppError } from '../../../utils/AppError.js';

export const BillboardRepository = {
  findHistoricalWeekDate: async (year, currentDate) => {
    try {
      const targetDate = new Date(currentDate);
      const targetMonth = targetDate.getMonth();
      const targetDay = targetDate.getDate();

      // Find the chart date that's closest to but not after the target month/day in the specified year
      const chart = await prisma.billboardChart.findFirst({
        where: {
          chartDate: {
            gte: new Date(year, 0, 1),    // Start of the specified year
            lt: new Date(year, targetMonth, targetDay + 1)  // Up to target date
          }
        },
        orderBy: {
          chartDate: 'desc'  // Get the most recent one before the target date
        },
        select: {
          chartDate: true
        }
      });

      if (!chart) {
        // If no chart found before the target date in that year, get the first chart of the year
        const firstChart = await prisma.billboardChart.findFirst({
          where: {
            chartDate: {
              gte: new Date(year, 0, 1),
              lt: new Date(year + 1, 0, 1)
            }
          },
          orderBy: {
            chartDate: 'asc'
          },
          select: {
            chartDate: true
          }
        });

        if (!firstChart) {
          throw new AppError(`No charts found for year ${year}`, 404);
        }

        return firstChart.chartDate.toISOString().split('T')[0];
      }

      return chart.chartDate.toISOString().split('T')[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Database error while finding historical week', 500);
    }
  },

  findChartByDate: async (date) => {
    try {
      const chart = await prisma.billboardChart.findFirst({
        where: {
          chartDate: new Date(date)
        },
        include: {
          entries: {
            orderBy: {
              thisWeek: 'asc'
            },
            select: {
              song: true,
              artist: true,
              thisWeek: true,
              lastWeek: true,
              peakPosition: true,
              weeksOnChart: true
            }
          }
        }
      });

      if (!chart) return null;

      // Transform the data to match the expected format
      return {
        weekNumber: await calculateWeekNumber(chart.chartDate),
        entries: chart.entries.map(entry => ({
          song: entry.song,
          artist: entry.artist,
          this_week: entry.thisWeek,
          last_week: entry.lastWeek,
          peak_position: entry.peakPosition,
          weeks_on_chart: entry.weeksOnChart
        }))
      };
    } catch (error) {
      throw new AppError('Database error while fetching chart', 500);
    }
  },

  findWeeksByYear: async (year) => {
    try {
      const charts = await prisma.billboardChart.findMany({
        where: {
          chartDate: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1)
          }
        },
        orderBy: {
          chartDate: 'asc'
        },
        select: {
          chartDate: true
        }
      });

      if (!charts.length) {
        throw new AppError(`No charts found for year ${year}`, 404);
      }

      // Transform dates to expected format
      return charts.map(chart => ({
        date: chart.chartDate.toISOString().split('T')[0]
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Database error while fetching weeks', 500);
    }
  }
};

// Helper function to calculate the week number for a given date
async function calculateWeekNumber(date) {
  try {
    const year = date.getFullYear();
    const count = await prisma.billboardChart.count({
      where: {
        chartDate: {
          gte: new Date(year, 0, 1),
          lte: date
        }
      }
    });
    return count;
  } catch (error) {
    throw new AppError('Error calculating week number', 500);
  }
} 