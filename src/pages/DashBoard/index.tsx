import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useRerender } from '../../hooks/useRerender';
import MainLayout from '../../components/MainLayout';
import useWindowDimensions from '../../hooks/useWindowDimension';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import RevenueIcon from '../../assets/images/RevenueIcon.png';
import GiveMoneyIcon from '../../assets/images/GiveMoneyIcon.png';
import RevenueOnEveryBid from '../../assets/images/RevenueOnBid.png';
import CreateFeeRevenue from '../../assets/images/CreateFeeRevenue.png';

interface IStatistic {
  productStatistics: {
    productsTotal: number;
    productsTotalByCategory: {
      category: string;
      total: number;
    };
  };
  transactionStatistics: {
    postSaleFeeStatistics: {
      average: number;
      min: number;
      max: number;
      total: number;
    };
    preSaleFeeStatistics: {
      total: number;
    };
    revenueStatistics: {
      average: number;
      min: number;
      max: number;
      total: number;
    };
  };
}

export default function DashBoard() {
  const { rerender } = useRerender();
  const { user, accessToken } = useAppSelector((state: IRootState) => state.auth);
  const [statisticData, setStatisticData] = useState<IStatistic | null>(null);
  const [listCategory, setListCategory] = useState<any[]>([]);
  const { openSideBar: open } = useAppSelector((state: IRootState) => state.auth);

  const [lineState, setLineState] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12',
        ],
      },
    },
    series: [
      {
        name: 'Số lượng',
        data: [7, 5, 5, 10, 30, 40, 8, 30, 41, 42, 43],
      },
    ],
  });

  const [barState, setBarState] = useState({
    options: {
      chart: {
        id: 'basic-line',
      },
      xaxis: {
        categories: [
          'Puma',
          'Louis Vuiton',
          'Balenciaga',
          'Channel',
          'Adidas',
          'Nike',
          'Saint Laurent',
          'Dior',
        ],
      },
    },
    series: [
      {
        name: 'Số lượng',
        data: [7, 5, 5, 10, 30, 40, 8, 5],
      },
    ],
  });

  const [pieState, setPieState] = useState({
    series: [44, 55, 13, 43, 22, 20, 30, 11],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Chiếu khấu sản phẩm', 'Phí đăng sản phẩm'],
      theme: {
        monochrome: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  const dimension = useWindowDimensions();

  useEffect(() => {
    setLineState((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        chart: {
          ...prev.options.chart,
          width: (dimension.width * 80) / 100,
        },
      },
    }));

    // Update dimensions for pie chart
    setPieState((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        chart: {
          ...prev.options.chart,
          width: (dimension.width * 80) / 100,
        },
      },
    }));

    // Update dimensions for bar chart
    setBarState((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        chart: {
          ...prev.options.chart,
          width: (dimension.width * 80) / 100,
        },
      },
    }));
  }, [dimension]);

  const getStatisticData = async () => {
    console.log('bearer token is', `Bearer ${accessToken}`);
    try {
      const res = await axios.get(`${apiURL}/statistics`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        let postSaleFeePortion =
          res.data.data.transactionStatistics.postSaleFeeStatistics.total /
          res.data.data.transactionStatistics.revenueStatistics.total;
        let preSaleFeePortion = 1 - postSaleFeePortion;
        //set pie state
        setPieState({
          series: [
            79000, 9000,
            // postSaleFeePortion * 100 || 70,
            // preSaleFeePortion * 100 || 30,
          ],
          options: {
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['Chiếu khấu sản phẩm', 'Phí đăng sản phẩm'],
            theme: {
              monochrome: {
                enabled: true,
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          },
        });

        const categories = res.data.data.productStatistics.productsTotalByCategory?.map(
          (item: any) => item?.category,
        );
        const quantityOnCategory = res.data.data.productStatistics.productsTotalByCategory?.map(
          (item: any) => item?.total,
        );

        setBarState({
          options: {
            chart: {
              id: 'basic-line',
            },
            xaxis: {
              categories: categories,
            },
          },
          series: [
            {
              name: 'Số lượng',
              data: quantityOnCategory,
            },
          ],
        });
        setStatisticData(res.data.data);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!!user) {
      getStatisticData();
    }
  }, [user]);

  return (
    <MainLayout
      title="Tổng quan thông tin của sàn"
      content={
        statisticData ? (
          <div className="flex flex-col gap-y-10 px-10">
            <div className="grid w-full grid-cols-2 flex-row items-center gap-x-5">
              <div className="rounded-xl bg-white px-10 py-5 shadow-lg drop-shadow-md">
                <p className="text-center text-xl font-bold text-gray-500">
                  Thống kê doanh thu của sàn
                </p>
                <div className="mt-4 flex w-full justify-center">
                  <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
                    <div className="w-full">
                      <div className="flex h-[180px] w-full cursor-pointer flex-col justify-between rounded-xl border border-gray-100 p-4 shadow-lg drop-shadow-md hover:opacity-50">
                        <p className="text-right text-sm font-bold text-gray-500">
                          Tổng lợi nhuận của sàn
                        </p>
                        <div className="my-2 flex flex-col items-center">
                          <img src={RevenueIcon} className="h-[80px] w-[100px]" />
                        </div>
                        <p className="text-md text-right font-bold text-green-600">
                          {(983)?.toString().prettyMoney()}
                        </p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex h-[180px] w-full cursor-pointer flex-col justify-between rounded-xl border border-gray-100 p-4 shadow-lg drop-shadow-md hover:opacity-50">
                        <p className="text-right text-sm font-bold text-gray-500">
                          Lợi nhuận trung bình / sản phẩm
                        </p>
                        <div className="my-2 flex flex-col items-center">
                          <img src={RevenueOnEveryBid} className="h-[80px] w-[100px]" />
                        </div>
                        <p className="text-md text-right font-bold text-green-600">
                          {(91)?.toString().prettyMoney()}
                        </p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex h-[180px] w-full cursor-pointer flex-col justify-between rounded-xl border border-gray-100 p-4 shadow-lg drop-shadow-md hover:opacity-50">
                        <p className="text-right text-sm font-bold text-gray-500">
                          Lợi nhuận chiết khấu
                        </p>
                        <div className="my-2 flex flex-col items-center">
                          <img src={GiveMoneyIcon} className="h-[80px] w-[100px]" />
                        </div>
                        <p className="text-md text-right font-bold text-green-600">
                          {(889)?.toString().prettyMoney()}
                        </p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex h-[180px] w-full cursor-pointer flex-col justify-between rounded-xl border border-gray-100 p-4 shadow-lg drop-shadow-md hover:opacity-50">
                        <p className="text-right text-sm font-bold text-gray-500">
                          Lợi nhuận từ phí đăng
                        </p>
                        <div className="my-2 flex flex-col items-center">
                          <img src={CreateFeeRevenue} className="h-[80px] w-[100px]" />
                        </div>
                        <p className="text-md text-right font-bold text-green-600">
                          {(94)?.toString().prettyMoney()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white px-10 py-5 shadow-lg drop-shadow-md">
                <p className="mb-2 text-center text-xl font-bold text-gray-500">
                  Biểu đồ tỷ lệ phần trăm doanh thu
                </p>
                <Chart
                  options={pieState.options as any}
                  series={pieState.series}
                  type="pie"
                  height="380"
                />
              </div>
            </div>
            <div className="w-full rounded-xl bg-white px-10 py-5 shadow-lg drop-shadow-md">
              {/* <p className="text-center text-2xl text-gray-500 font-bold mb-4">
            Doanh thu của cửa hàng theo tháng (2023)
          </p>
          <Chart
            options={lineState.options}
            series={lineState.series}
            type="line"
            width="99%"
            height="280"
          /> */}
              <p className="text-center text-xl font-bold text-gray-500">
                Số lượng sản phẩm đang có trên sàn theo từng danh mục
              </p>
              <Chart options={barState.options} series={barState.series} type="bar" height="300" />
            </div>
          </div>
        ) : null
      }
    />
  );
}
