> 原始笔记：Flow model & Flow Matching  
> 来源：[Notion 页面](https://app.notion.com/p/23676ad5de008056876de603966dcd6f)

# Preliminary

Flow-based model 的基础是可逆变换与变量变换公式。

给定 \(\mathbf{z}\sim\pi(\mathbf{z})\)，通过一对一映射 \(\mathbf{x}=f(\mathbf{z})\) 构造新变量。如果 \(f^{-1}\) 存在，则：

$$
p(\mathbf{x})
=
\pi\left(f^{-1}(\mathbf{x})\right)
\left|
\det
\frac{\partial f^{-1}}{\partial \mathbf{x}}
\right|.
$$

# Velocity Field、Flow 与 Probability Path

## 速度场：河流本身

在河流的每一个位置，水流都有特定的方向和速度。描述整条河流状态的“地图”，就是速度场 \(u_t(\mathbf{x})\)。

速度场告诉我们：如果一个粒子在时间 \(t\) 位于 \(\mathbf{x}\)，它应该以什么方向和速度运动。

## Flow：树叶的漂流轨迹

把一片树叶放入河中，它会顺着速度场漂流。树叶从起点出发，在时间内走过的完整轨迹，就是 Flow，记为 \(\psi_t(\mathbf{x})\)。

速度场是规则，Flow 是结果。二者由 ODE 联系：

$$
\frac{d}{dt}\psi_t(\mathbf{x})
=
u_t\left(\psi_t(\mathbf{x})\right).
$$

## Continuity Equation

概率路径 \(p_t(\mathbf{x})\) 与速度场之间满足连续性方程：

$$
\frac{d}{dt}p_t(\mathbf{x})
+
\operatorname{div}\left(p_tu_t\right)(\mathbf{x})
=
0.
$$

它表达的是概率质量守恒：粒子不会凭空消失，只是在向量场推动下移动。Fokker–Planck 方程可以描述随机系统中的概率密度；去掉扩散项后，就得到确定性系统中的连续性方程。

# Normalizing Flows

Normalizing Flow（NF）通过一系列可逆的概率密度变换，将简单分布（如高斯分布）变成复杂目标分布。

如果：

$$
\mathbf{x}
=
f_K\circ\cdots\circ f_2\circ f_1(\mathbf{z}),
$$

那么可以利用每个变换的 Jacobian determinant 计算密度：

$$
p_1(\mathbf{x})
=
p_0(\mathbf{z})
\left|
\det
\frac{\partial\mathbf{z}}{\partial\mathbf{x}}
\right|.
$$

NF 的优点是可以直接计算似然，采样和密度估计都很清晰；缺点是为了保证可逆性和 Jacobian determinant 易于计算，通常需要特殊的网络结构。

# Continuous Normalizing Flows

Continuous Normalizing Flow（CNF）可以看作 NF 在时间维度上的连续化。它用 ODE 定义从简单分布到复杂分布的变换：

$$
\frac{d}{dt}\psi_t(\mathbf{x})
=
u_t\left(\psi_t(\mathbf{x})\right),
\qquad
\psi_0(\mathbf{x})=\mathbf{x}.
$$

# Flow Matching

## 核心思想

Flow matching 不直接学习复杂的变换 \(\psi_t(\mathbf{x})\) 或目标密度 \(p_1(\mathbf{x})\)，而是直接学习一个目标速度场 \(u_t(\mathbf{x})\)：

$$
\mathcal{L}_{\mathrm{FM}}(\theta)
=
\mathbb{E}_{t,\mathbf{x}_t}
\left[
\left\|
v_\theta(\mathbf{x}_t,t)
-
u_t(\mathbf{x}_t)
\right\|_2^2
\right].
$$

在时间 \(t\) 采样一个点 \(\mathbf{x}_t\)，让网络预测的速度 \(v_\theta(\mathbf{x}_t,t)\) 尽可能接近真实速度 \(u_t(\mathbf{x}_t)\)。

## Flow Matching 的难处

这个目标很直接，但真实的边际路径 \(p_t(\mathbf{x})\) 和边际速度场 \(u_t(\mathbf{x})\) 通常无法获得：

- \(p_t(\mathbf{x})\) 难以直接采样，因为完整的演化路径正是我们要学习的对象。
- \(u_t(\mathbf{x})\) 依赖整个数据分布，直接计算在高维场景中不可行。

## 从条件路径构造可计算的监督

与其直接定义困难的边际路径，不如为每个数据点 \(\mathbf{x}_1\) 定义一条容易计算的条件路径 \(p_t(\mathbf{x}\mid\mathbf{x}_1)\) 及其条件速度 \(u_t(\mathbf{x}\mid\mathbf{x}_1)\)。

一种常见选择是高斯条件路径：

$$
p_t(\mathbf{x}\mid\mathbf{x}_1)
=
\mathcal{N}
\left(
\mathbf{x};
\mu_t(\mathbf{x}_1),
\sigma_t^2(\mathbf{x}_1)\mathbf{I}
\right).
$$

边际路径由条件路径积分得到：

$$
p_t(\mathbf{x})
=
\int
p_t(\mathbf{x}\mid\mathbf{x}_1)
q(\mathbf{x}_1)
\,d\mathbf{x}_1.
$$

## Conditional Flow Matching

Conditional Flow Matching（CFM）使用条件速度作为监督：

$$
\mathcal{L}_{\mathrm{CFM}}(\theta)
=
\mathbb{E}_{t,\mathbf{x}_1,\mathbf{x}_t}
\left[
\left\|
v_\theta(\mathbf{x}_t,t)
-
u_t(\mathbf{x}_t\mid\mathbf{x}_1)
\right\|_2^2
\right].
$$

它的关键价值是：虽然训练时使用条件路径，但在适当条件下，CFM 与原始 FM 目标具有相同的最优解。

## 线性路径与最优传输

最简单的路径是从噪声 \(\mathbf{x}_0\) 到数据 \(\mathbf{x}_1\) 的线性插值：

$$
\mathbf{x}_t
=
(1-t)\mathbf{x}_0+t\mathbf{x}_1,
\qquad
\frac{d\mathbf{x}_t}{dt}
=
\mathbf{x}_1-\mathbf{x}_0.
$$

在最优传输视角下，直线轨迹通常是自然且高效的选择。若使用 \(\sigma_{\min}\) 控制终点尺度，则：

$$
\psi_t(\mathbf{x}_0)
=
\left(1-(1-\sigma_{\min})t\right)\mathbf{x}_0
+
t\mathbf{x}_1,
$$

对应速度为：

$$
v_t
=
\mathbf{x}_1-(1-\sigma_{\min})\mathbf{x}_0.
$$

## 为什么 Flow Matching 值得关注？

- **训练更像回归**：网络直接预测一个速度向量，通常比学习可能不稳定的 score 更容易优化。
- **路径可控**：可以主动指定起点分布、终点分布以及中间概率路径，不必完全依赖扩散过程的渐近近似。
- **采样更直接**：训练完成后，从噪声分布出发，求解 ODE 即可得到数据样本。

# 采样

从简单分布开始：

$$
\mathbf{x}_0\sim\mathcal{N}(0,\mathbf{I}),
$$

然后求解：

$$
\frac{d\mathbf{x}_t}{dt}
=
v_\theta(\mathbf{x}_t,t),
\qquad t:0\rightarrow1.
$$

终点 \(\mathbf{x}_1\) 就是生成样本。

# 总结

Flow matching 把生成问题重新描述成运输问题：学习一张时间依赖的速度地图，而不是反复猜测下一步噪声。Conditional Flow Matching 则把不可计算的边际监督转换成可计算的条件监督，同时保留目标概率路径。

