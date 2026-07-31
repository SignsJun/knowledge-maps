# Flow Models & Flow Matching

> 一句话：Flow matching 直接学习一个随时间变化的速度场，用 ODE 把简单分布运输成目标数据分布。

- 整理自 Notion 笔记：2025-07-20
- 原始笔记：[Flow model & Flow Matching](https://app.notion.com/p/23676ad5de008056876de603966dcd6f)

## 1. 从变量变换开始

如果 `z ~ π(z)`，通过可逆映射 `x=f(z)` 得到新变量，那么高维变量的密度满足：

$$
p(x)=\pi\left(f^{-1}(x)\right)
\left|\det\frac{\partial f^{-1}}{\partial x}\right|.
$$

Normalizing Flow（NF）就是把多个可逆变换串起来，把简单分布变成复杂分布，同时利用 Jacobian determinant 追踪密度变化。

## 2. 速度场、Flow 与概率路径

Notion 笔记使用“河流”的比喻：

- **速度场 `uₜ(x)`**：河流在每个位置、每个时刻的方向和速度，是一张规则地图。
- **Flow `ψₜ(x)`**：从某个初始位置出发的粒子实际走过的轨迹。
- **概率路径 `pₜ(x)`**：所有粒子在时刻 `t` 的整体分布。

速度场与 Flow 通过 ODE 联系：

$$
\frac{d}{dt}\psi_t(x)=u_t\left(\psi_t(x)\right).
$$

概率路径与速度场通过连续性方程联系：

$$
\frac{d}{dt}p_t(x)+\mathrm{div}\left(p_tu_t\right)(x)=0.
$$

连续性方程表达的是概率质量守恒：粒子不会凭空消失，只是在向量场的推动下移动。

## 3. CNF 与确定性生成

Continuous Normalizing Flow（CNF）把离散的可逆层换成连续时间 ODE。给定一个简单的初始分布 `p₀`，求解：

$$
\frac{dx_t}{dt}=v_\theta(x_t,t)
$$

就可以把样本从 `p₀` 推到 `p₁`。这提供了清晰的概率路径，但直接设计和学习正确的边际速度场仍然困难。

## 4. Flow matching 的核心目标

Flow matching 不直接模拟复杂的边际路径，而是让网络拟合目标速度场：

$$
\mathcal{L}_{\text{FM}}(\theta)
=\mathbb{E}_{t,x_t}
\left[\left\|v_\theta(x_t,t)-u_t(x_t)\right\|_2^2\right].
$$

难点是：真实数据分布的边际路径 `pₜ` 和速度场 `uₜ` 往往未知，无法直接作为监督信号。

## 5. Conditional Flow Matching

解决办法是先为每一个数据样本构造一个容易计算的条件概率路径 `pₜ(x\mid x₁)` 和条件速度场 `uₜ(x\mid x₁)`，再训练：

$$
\mathcal{L}_{\text{CFM}}(\theta)
=\mathbb{E}_{t,x_1,x_t}
\left[\left\|v_\theta(x_t,t)-u_t(x_t\mid x_1)\right\|_2^2\right].
$$

常见选择是从高斯噪声 `x₀` 到数据 `x₁` 的高斯条件路径。这样，训练时的目标速度可以计算，模型却能够学习到对应的边际流场。

一个直观的线性路径写法是：

$$
x_t=(1-t)x_0+t x_1,
\qquad \frac{dx_t}{dt}=x_1-x_0.
$$

实际方法可以使用 diffusion-style conditional vector field 或 optimal-transport conditional vector field；它们对应不同的路径设计与运输几何。

## 6. 采样

训练完成后，从 `x₀ ~ N(0,I)` 开始，使用 ODE solver 积分：

$$
\frac{dx_t}{dt}=v_\theta(x_t,t),\qquad t:0\rightarrow1.
$$

终点 `x₁` 就是生成样本。与需要许多随机去噪步的扩散采样相比，Flow matching 的轨迹更直接，也更容易使用少量 ODE 步数进行加速。

## 7. 我的理解

Flow matching 把“生成”重新描述成“运输”：不是让模型反复猜下一步噪声，而是学习一张完整的时间依赖速度地图。Conditional flow matching 的价值，在于把不可直接计算的边际监督，转成可计算的条件监督，同时保留目标概率路径。

> Notion 中的图片使用了会过期的临时资源链接，因此这里没有直接复制图片 URL。
