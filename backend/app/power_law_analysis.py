import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy.stats as stats
from neo4j import GraphDatabase
from database import driver
 
# 获取度数分布
def get_degree_distribution(driver):
    with driver.session() as session:
        query = "MATCH (n) RETURN n.osmid AS osmid, SIZE([(n)-[]-() | 1]) AS degree"
        result = session.run(query)
        degrees = result.data()
    
    degrees_df = pd.DataFrame(degrees)
    degrees_df.columns = ['osmid', 'degree']
    return degrees_df
 
# 绘制度数分布图
def plot_degree_distribution(degrees_df):
    degrees = degrees_df['degree'].values
    counts, bins = np.histogram(degrees, bins=np.arange(min(degrees), max(degrees) + 2) - 0.5)
    
    plt.figure(figsize=(10, 6))
    plt.loglog(bins[:-1], counts, 'bo-')
    plt.xlabel('Degree (log scale)')
    plt.ylabel('Frequency (log scale)')
    plt.title('Degree Distribution')
    plt.grid(True, which="both", ls="--")
    plt.show()
 
# 拟合幂律分布
def fit_power_law(degrees_df):
    degrees = degrees_df['degree'].values
    counts, bins = np.histogram(degrees, bins=np.arange(min(degrees), max(degrees) + 2) - 0.5)
    
    # 转换为幂律分布所需的格式
    x = bins[:-1]
    y = counts
    y = y[y > 0]  # 忽略0值
    x = x[y > 0]
    
    # 拟合幂律分布
    params = stats.powerlaw.fit(x, floc=0)
    alpha = params[0]
    
    print(f"Estimated power law exponent (gamma): {alpha}")
    
    # 绘制拟合结果
    plt.figure(figsize=(10, 6))
    plt.loglog(x, y, 'bo-', label='Data')
    plt.loglog(x, stats.powerlaw.pdf(x, alpha, loc=0), 'r-', label=f'Power law fit (gamma={alpha})')
    plt.xlabel('Degree (log scale)')
    plt.ylabel('Frequency (log scale)')
    plt.title('Power Law Fit')
    plt.legend()
    plt.grid(True, which="both", ls="--")
    plt.show()
 
# 执行幂律分析
def analyze_power_law():
    degrees_df = get_degree_distribution(driver)
    plot_degree_distribution(degrees_df)
    fit_power_law(degrees_df)
 
# 运行幂律分析
if __name__ == "__main__":
    analyze_power_law()