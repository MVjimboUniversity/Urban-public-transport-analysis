import asyncio
import json
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats
from app.routers.network import network_by_name
from scipy.optimize import curve_fit

# 幂律分布函数
def power_law(x, alpha):
    return x**(-alpha)
 
# 绘制分布图和拟合结果的函数
def plot_power_law(values, fit_params):
    values = np.array(values)
    # 对数据进行排序（如果未排序）
    values_sorted = np.sort(values)
    # 计算累积分布函数（CDF）的值，用于绘制
    cdf_values = np.arange(1, len(values_sorted) + 1) / len(values_sorted)
    # 绘制原始数据的CDF
    plt.plot(values_sorted, cdf_values, 'o', label='Original Data CDF')
    # 绘制拟合的幂律分布CDF（需要对PDF进行积分得到CDF的近似）
    fit_x = np.linspace(min(values_sorted), max(values_sorted), 1000)
    fit_y = (fit_x**(-fit_params[0])) / (fit_params[0] * min(values_sorted)**(1 - fit_params[0]))
    fit_y_cdf = np.cumsum(fit_y) / np.sum(fit_y)  # 归一化积分得到CDF
    plt.plot(fit_x, fit_y_cdf, '-', label=f'Power Law Fit: α={fit_params[0]:.2f}')
    plt.xscale('log')
    plt.yscale('log')
    plt.xlabel('Center Count ')
    plt.ylabel('Cumulative Distribution Function')
    plt.legend()
    plt.title('Center Count  Distribution and Power Law Fit')
    plt.show()
 
async def main():
    city_name = input("Пожалуйста, введите название города: ")
    connected = False
    filters = {'bus': True, 'tram': False, 'trolleybus': False, 'subway': False}
    
    response = await network_by_name(city_name, connected, filters)
    data = json.loads(response)
    features_list = data['nodes']['features']
    center_count = [feature['properties']['center_count'] for feature in features_list]
    # 拟合幂律分布（可能需要调整，取决于数据的特性和范围）
    params, _ = curve_fit(power_law, center_count , np.arange(len(center_count)), p0=[1])
    # 绘制分布图和拟合结果
    plot_power_law(center_count, params)

 
# 运行事件循环，并调用主函数
asyncio.run(main())
