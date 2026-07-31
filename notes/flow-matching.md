> 原始笔记：Flow model & Flow Matching
> 来源：[Notion 页面](https://app.notion.com/p/23676ad5de008056876de603966dcd6f)
>
# Preliminary
- Jacobian Matrix
- det
- Change of Variable theorem
	给定一个随机变量 \(z\) 及其概率密度函数 \({z}\sim \pi(z)\)，通过一个一对一的映射函数 \(f\) 构造一个新的随机变量 \(x = f(z)\)。如果存在逆函数 \(f^{-1}\)，那么新变量 \(x\) 的概率密度函数 \(p(x)\) 计算如下：
	**（1）当 **\(x\)** 为一维随机变量：**
	$$
	p(x)=\pi (z)\left| \tfrac{dz}{dx} \right|=\pi \left( f^{-1}(x) \right) \left| \tfrac{df^{-1}}{dx} \right|=\pi \left( f^{-1}(x) \right) \left| \bigl( f^{-1} \bigr) ^{\prime}(x) \right|
	$$
	**（2）当 **\(x\)** 为高维随机变量：**
		$$
		p(\mathbf{x})=\pi (\mathbf{z})\left| \det \tfrac{d\mathbf{z}}{d\mathbf{x}} \right|=\pi \left( f^{-1}(\mathbf{x}) \right) \left| \det \tfrac{df^{-1}}{d\mathbf{x}} \right|
		$$
# Velocity Field（速度场）& Flow & Probability path
## 1. 速度场 (Velocity Field)：河流本身
想象一条大河。
- 在河的**每一个位置**，水的流动都有一个特定的**方向**和**速度**。
- 比如，河中央的水流得快，靠近岸边的水流得慢，遇到石头的地方还会形成漩涡。
- 这个描述了**整个河流所有点的水流情况**的“地图”，就是**速度场**（在公式里用 `u` 或 `v` 表示）。
**速度场 (Velocity Field) 的核心特性：**
- **它是一个“规则手册”或“地图”**：它告诉你，**如果**一个粒子在时间 `t` 位于位置 `x`，那么它**应该**以什么样的速度运动。
- **它本身是静态的**：它描述的是一种“势能”或“潜力”。就像一张标明了所有风向和风速的天气图，地图本身不动，但它决定了气球会怎么飞。
- **数学上**：它是一个函数 `u_t(x)`，输入一个时间和位置，输出一个速度向量。
---
## 2. 流 (Flow)：树叶的漂流轨迹
现在，你在这条河的某个点 `x` 放入一片树叶。
- 这片树叶会**顺着**河水（也就是速度场）开始漂流。
- 它在下一秒会到哪里，完全取决于它当前位置的水流速度和方向。
- 这片树叶从起点 `x` 开始，随着时间流逝画出的**完整运动轨迹**，就是**流 (Flow)**（在公式里用 `ψ` 表示）。
**流 (Flow) 的核心特性：**
- **它是一个“运动过程”或“路径”**：它描述了一个粒子**实际**上是如何从起点移动到终点的。
- **它是动态的**：它描述的是一个随时间演变的过程。
- **数学上**：它是一个函数 `ψ_t(x)`，输入一个初始位置 `x` 和一个时间 `t`，输出该粒子在时间 `t` 的**新位置**。`ψ` 本身代表了所有可能起点的粒子所形成的整个轨迹族。

Flow的定义应该是 \([0,1]\)时间内不同初值下的轨迹集合
---
## 关系：规则与结果
**速度场是“因”，流是“果”。**
它们之间的关系，可以由常微分方程 (ODE) 完美地联系在了一起：
$$
\frac{d}{dt} \psi_t(x) = u_t(\psi_t(x))
$$
我们来拆解这个公式，把它翻译成“人话”：
- **`ψ_t(x)`**: 在时间 `t`，那片从 `x` 出发的树叶的**当前位置**。
- **`d/dt ψ_t(x)`**: 树叶在 `t` 时刻的**瞬时速度**（它的速度和方向）。
- **`u_t(...)`**: 速度场（河流的地图）。
- **`u_t(ψ_t(x))`**: 在 `t` 时刻，树叶**所在位置**的**水流速度**。
所以，整个公式的意思就是：
**“树叶在任意时刻的运动速度，就等于它当前所在位置的河水流速。”**
这完美地描述了我们的直觉：是河水（速度场）在“推着”树叶（流）前进。
---
## **Continuity Equation **连续性方程& Fokker-Planck Equation

	$$
	\frac{\mathrm{d}}{\mathrm{d}t}p_t(x)+\mathrm{div(}p_tu_t)(x)=0
	$$

作用：向量场 \(u_t(x)\) 是否可以产生概率路径 \(p_t\)，若可以则要满足上述方程
 
**Continuity Equation**是判断向量场 \(u_t(x)\) 产生对应的概率密度路径 \(p_t\)的**充分必要条件**。如果向量场 \(u_t(x)\) 和概率密度路径 \(p_t\) 满足**Continuity Equation**，则在**CNFs**中该向量场 \(u_t(x)\)就能产生对应的概率密度路径 \(p_t\) 。
补充：
Fokker-Planck 方程可以用于描述概率密度
连续性方程来源于 Fokker-Planck 方程，只是将扩散项给去掉，将一个“随机系统”退化成一个“确定性系统”
> [Notion 图片已省略：原链接为临时地址]

## Flow & Velocity field & Probability path 的关系
Flow 和 Velocity field 可以根据 ODE 方程描述他们之间的关系， 而 Probability path 和 Velocity field 可以根据连续性方程描述之间的关系。
> [Notion 图片已省略：原链接为临时地址]

# Normalizing Flows (NF) - 归一化流
对应 flow based model  可以对应看 **Glow** 这篇文献
NF 是一种通过一系列可逆的概率密度变换方法，将一个简单分布（如高斯分布）变换为复杂目标分布的生成模型。**这个过程可以被看作是一连串的变量替换的迭代过程，每次替换都遵循概率密度函数的变量变换原则**。
**核心思想：**
1. **可逆映射**: NF 使用一系列可逆的函数 \(f_1,f_2,\dots,f_K\)。
	- \(x=f_K(\dots f_2(f_1(z))\dots)\)
	- \(z=f_1^{−1}(f_2^{−1}(\dots f_K^{−1}(x)\dots))\) 
	每个 \(f_i\) 都是可逆的，并且其雅可比行列式 (Jacobian determinant) 容易计算。
2. **变量变换公式**: 如果我们知道 \(z\) 服从 \(p_0(z)\)，通过可逆变换 \(x=f(z)\)，那么 \(x\)  的概率密度函数 \(p_1(x)\) 可以根据变量变换公式得到
	$$
	p_1(x)=p_0(z)|\det(\frac{\partial z}{\partial x})|=p_0(f^{−1}(x))|\det(\frac{\partial f^{-1}}{\partial x}(x))|
	$$
	或者更常用的是
	$$
	p_1(x)=p_0(z)\left| \det \left( \tfrac{\partial x}{\partial z} \right) ^{-1} \right|=p_0(z)\left| \det \left( \tfrac{\partial f(z)}{\partial z} \right) \right|^{-1}
	$$
**优点**: 可以直接计算似然 (likelihood)，因此可以通过最大化似然来训练。采样和密度估计都很直接。
**缺点**: 为了保证可逆性和雅可比行列式易于计算，通常需要设计非常特殊的网络结构（比如耦合层 **Coupling Layers**, 自回归层 Autoregressive Layers 等），这限制了模型的表达能力，并且有时计算成本较高。
# Continuous Normalizing Flows (CNF) - 连续归一化流
CNF 可以看作是 NF 在时间维度上的连续化极限。它使用**常微分方程 (ODE)** 来定义从简单分布到复杂分布的变换。
一个 \(C^r\) 阶的流 \(\psi\) 可以通过一个 \(C^r([0, 1] \times \mathbb{R}^d, \mathbb{R}^d)\) 的速度场 \(u: [0, 1] \times \mathbb{R}^d \to \mathbb{R}^d\) 来定义，该速度场将 \((t, x)\) 映射为 \(u_t(x)\)，并遵循以下常微分方程 (ODE)：
$$
\begin{align*}    \frac{d}{dt}\psi_t(x) &= u_t(\psi_t(x)) \quad &\text{(flow ODE)} \\    \psi_0(x) &= x \quad &\text{(flow initial condtion)} \end{align*}
$$
> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

> [Notion 图片已省略：原链接为临时地址]

# Flow Matching
## **Flow matching **核心思想
因为前面的 Normalizing Flows 在进行学习时，运算量大，且要保证可逆性和雅可比行列式易于计算，通常需要设计非常特殊的网络结构（比如耦合层 **Coupling Layers）**所以希望更改一下学习的对象和目标。
Flow Matching 的核心思想是，它**不再直接学习一个复杂的变换 **\(\psi_t(x)\)** 或概率密度 **\(p_1(x)\)，而是**直接学习一个“理想”的或“目标”的速度场 **\(u(x,t)\)，那么由于 Flow & Velocity field & Probability path 的关系（ODE 和 Continuing Equation），则我们的优化目标函数可以为：
$$
L_{FM}=\mathbb{E} _{t\sim U[0,1],x_t\sim p_t(x)}\left\| v_{\theta}(x_t,t)-u_t(x_t)\parallel ^2 \right] 
$$
在 `0` 到 `1` 的任意时间 `t`，从那个时刻的**宏观概率分布 ****`p_t(x)`** 中随机抽取一个点 `x_t`，然后让我们的神经网络 `v_θ` 预测的速度，与该点的**真实宏观速度 ****`u_t(x_t)`** 尽可能地接近。
## Flow Matching 的难处，真实情况
这个目标看起来非常优雅，但在实践中却遇到了一个几乎无法逾越的鸿沟：
> 我们根本无法知道 \(p_t(x)\) 和 \(u_t(x)\) 是什么！
让我们来分析一下这两个“拦路虎”：
1. \(p_t(x)\)** (宏观概率路径) 无法采样**：
	- \(p_t(x)\) 是从初始噪声分布 \(p_0\) 演化到 \(t\) 时刻的中间分布。
	- 想要从这个分布中采样一个点 \(x_t\)，我们就必须知道从 \(p_0\) 到 \(p_t\) 的完整变换路径，但我们要学习的就是这个路径。
2. \(u_t(x)\)** (宏观速度场) 无法计算**：
	- \(u_t(x)\) 是定义在整个宏观概率云团上的速度。
	- 它的计算依赖于整个数据分布 \(p_1\) 和 \(p_0\) 之间的某种“最优传输”路径，这个计算本身极其复杂，在实际高维数据（如图像）中是不可行的。
## 从条件概率路径和向量场构造 \(p_t\) 和 \(u_t\)
混搭简单路径来构造复杂路径
从 \(p_0\) 到 \(p_1\) 的宏观路径太难，我们就换个思路。我们只定义那些从一个**公共的起点分布** \(p_0(x)\) 出发，到达**某一个特定数据点 **\(x_1\)的“微观路径”。这条路径就是**条件概率路径 **\(p_t(x|x_1)\)， \(p_t(x|x_1)\)的设置如下：
- 在 \(t=0\) 时，设置 \(p_0(x|x_1)=p(x)\)
- 在 \(t=1\) 时，设置 \(p_1(x|x_1)=N(x;x_1,\sigma^2 I)\)，此时的概率密度函数就会有很好的性质，就像是激活函数一样，在 \(x_1\) 处时存在较正常的值，而在其余地方则很小
那么则有
$$
p_t(x)=\int{p_t(x|x_1)q(x_1)dx_1,}
$$
并且有
$$
p_1(x)=\int{p_1(x|x_1)q(x_1)dx_1}\approx q(x)
$$
上式就像是做了convolution，而此时 \(p_1(x|x_1)\approx\delta (x-x_1)\)
并且对应有 \(u_t(x)\)
$$
u_t(x)=\int{u_t(x|x_1)\frac{p_t(x|x_1)q(x_1)}{p_t(x)}dx_1,}
$$
此时的\(u_t(x)\) 与其导出的 \(p_t(x)\) 满足continuing equation
$$
\begin{aligned}	\frac{d}{dt}p_t(x)&=\int{\bigl( \frac{d}{dt}p_t(x|x_1) \bigr) q(x_1)dx_1}=-\int{\mathrm{div}\bigl( u_t(x|x_1)p_t(x|x_1) \bigr) q(x_1)dx_1}\\	&=-\mathrm{div}\bigl( \int{u_t(x|x_1)p_t(x|x_1)q(x_1)dx_1} \bigr) =-\mathrm{div}\bigl( u_t(x)p_t(x) \bigr) ,\\\end{aligned}
$$
## Conditional Flow Matching
---
### 第一部分：“不幸的是...” —— 理论的实践困境
不幸的是，由于在边际概率路径和向量场（VF）的定义（公式 \(p_t(x)\) 和 \(u_t\)）中存在难以处理的积分，计算宏观速度场 \(u_t\) 仍然是难以做到的 ，所以我们还是不能直接去用那个最原始的 Flow Matching 目标函数 \(L_{FM}\) 进行训练。
### 第二部分：条件流匹配 (CFM) 目标函数
既然正面硬攻不行，研究者们就提出了一条绝妙的“侧路”，这就是 **Conditional Flow Matching (CFM) 目标函数**
$$
L_{CFM}(\theta) = E_{t, q(x_1), p_t(x|x_1)} [ \|v_θ(x, t) - u_t(x|x_1)\|^2 ]
$$
- \(E_{t, q(x_1), ...}\)** (取样)**：
	- 首先，从真实数据分布 \(q(x_1)\) 中随机抽取一个样本 \(x_1\)。
	- 然后，随机选择一个时间 \(t\)。
- \(...p_t(x|x_1)\)** (计算路径点) 需要**<span color="green_bg">**设计条件密度**</span>：
	- 从**条件概率路径** \(p_t(x|x_1)\) 中采样一个点 \(x\)。
	- （在最简单的直线路径情况下，这一步就是直接计算 \(x = (1-t)x_0 + t*x_1\)，其中 \(x_0\) 是一个随机噪声。）
- \(|| ... ||^2\)** (计算差距)**：
	- \(v_\theta(x, t)\)：这是我们神经网络的**预测**。输入路径点 \(x\) 和时间 \(t\)，预测一个速度。
	- \(u_t(x|x_1)\)：这是我们的**目标**。注意！这里的目标不再是那个无法计算的宏观速度 \(u_t\)，而是我们自己定义的、非常简单的**条件速度**！
	- （在最简单的直线路径情况下，这个目标就是 \(x_1 - x_0\)。）
重点！ 
**定理2：**假设对于所有的 `x` 和 `t`，概率密度 `p_t(x)` 恒大于0，那么在不考虑一个与 `θ` 无关的常数项的情况下，`L_CFM` 和 `L_FM` 是相等的。因此，**它们对参数 ****`θ`**** 的梯度是完全相同的**
Proof：
\(p_t(x|x_1)\)为确保下文中所有积分的存在，并允许交换积分顺序（根据富比尼定理, Fubini's Theorem），我们假设当 \(\|x\| \to \infty\)时， \(q(x)\) 和 \(p_t(x|x_1)\) 都以足够快的速度衰减至零，并且 \(u_t, v_t, \nabla_\theta v_t\) 都是有界的。
首先，使用标准的2-范数的双线性性质，我们有：
$$
\begin{align*}
    \|v_t(x) - u_t(x)\|^2 &= \|v_t(x)\|^2 - 2\langle v_t(x), u_t(x) \rangle + \|u_t(x)\|^2 \\
    \|v_t(x) - u_t(x|x_1)\|^2 &= \|v_t(x)\|^2 - 2\langle v_t(x), u_t(x|x_1) \rangle + \|u_t(x|x_1)\|^2
\end{align*}
$$
接下来，请记住 \(u_t\) 是与 \(\theta\) 无关的，并注意到：
$$
\begin{align*}
    \mathbb{E}_{p_t(x)}[\|v_t(x)\|^2] &= \int \|v_t(x)\|^2 p_t(x) dx \\
    &= \int \|v_t(x)\|^2 p_t(x|x_1) q(x_1) dx_1 dx \\
    &= \int q(x_1) \int p_t(x|x_1) \|v_t(x)\|^2 dx dx_1 \\
    &= \mathbb{E}_{q(x_1), p_t(x|x_1)}[\|v_t(x)\|^2],
\end{align*}
$$
其中第二个等式我们使用了公式条件概率，第三个等式我们交换了积分顺序。
接着，我们有：
 \(\begin{aligned}	\mathbb{E} _{p_t(x)}\left. \langle v_t(x),u_t(x) \right. \rangle &=\int{\left. \langle v_t(x),\frac{\int{u_t(x|x_1)p_t(x|x_1)q(x_1)dx_1}}{p_t(x)} \right. \rangle p_t(x)dx}\\	&=\int{\left. \langle v_t(x),\int{u_t(x|x_1)p_t(x|x_1)q(x_1)dx_1} \right. \rangle dx}\\	&=\int{\left. \langle v_t(x),u_t(x|x_1) \right. \rangle p_t(x|x_1)q(x_1)dx_1dx}\\	&=\mathbb{E} _{q(x_1),p_t(x|x_1)}\left. \langle v_t(x),u_t(x|x_1) \right. \rangle ,\\\end{aligned}\)
其实就是从先积分在对 \(x\) 做内积，转化成先对 \(x\) 做内积再做积分
---
<span color="brown_bg">FM 目标函数和 CFM 目标函数，它们关于模型参数 </span><span color="brown_bg">`θ`</span><span color="brown_bg"> 的</span><span color="brown_bg">**梯度是完全相同的**</span><span color="brown_bg">。</span>

## 条件概率流与向量场
CFM 框架的伟大之处在于，你**可以选择任意一种**“条件概率路径” \(p_t(x|x_1)\) 和其对应的“条件速度” \(u_t(x|x_1)\) 来进行训练。
既然可以随便选，那我们当然要选一个**最简单、最方便计算**的。
研究者们选择的这条“最好走的路”就是**高斯路径 (Gaussian path)**。
此时假设\(p_t(x|x_1)\)  为
$$
p_t(x|x_1) = N(x | μ_t(x_1), σ_t(x_1)²I)
$$
**这条路径的起点和终点被设计成：**
- \(t=0\)** (起点)**： \(μ_0=0\), \(\sigma_0=1\)。云的中心在原点，大小为1。这就是一个标准的**高斯噪声**。
- \(t=1\)** (终点)**： \(μ_1=x_1\), \(\sigma_1=\sigma_{min}\) (一个很小的值)。云的中心移动到了我们的**目标数据点 **\(x_1\) 上，并且云收缩得非常小，几乎就是一个点。
设定最简单的flow 则有
$$
ψ_t(x) = σ_t(x_1)x + μ_t(x_1)
$$
**定理3:** 假设 \(p_t(x|x_1)\) 是 Gaussian probability path，且定义如上，并且 \(\psi_t\) 是对应的 corresponding flow map，则有
$$
u_t(x|x_1) = (\frac{σ_t'(x_1)}{σ_t(x_1)})(x - μ_t(x_1)) + μ_t'(x_1)
$$
> [Notion 图片已省略：原链接为临时地址]

定理3给出了场的设定，因此损失函数
$$
L_{CFM}(\theta) = E_{t, q(x_1), p_t(x|x_1)} [ \|v_θ(x, t) - u_t(x|x_1)\|^2 ]
$$
即可计算
## 定理3 的验证（两种情况）
### Diffusion conditional VFs
使用 VE-SDE 和 VP-SDE 进行验证定理三是否成立。
<table>
<tr>
<td>特性</td>
<td>VP-SDE (方差保持)</td>
<td>VE-SDE (方差爆炸)</td>
</tr>
<tr>
<td>核心思想</td>
<td>逐渐将数据拉向原点，同时添加噪声</td>
<td>保持数据均值，添加越来越强的噪声</td>
</tr>
<tr>
<td>灵感来源</td>
<td>DDPM (Denoising Diffusion Probabilistic Models)</td>
<td>NCSN (Noise Conditional Score Networks)</td>
</tr>
<tr>
<td>均值变化</td>
<td>逐渐衰减到 0</td>
<td>基本保持不变</td>
</tr>
<tr>
<td>方差变化</td>
<td>从原始方差增长并收敛到 1</td>
<td>从 0 增长到 ∞</td>
</tr>
<tr>
<td>最终分布</td>
<td>标准正态分布 N(0,I)</td>
<td>均值不变，方差无穷大的高斯分布</td>
</tr>
<tr>
<td>前向 SDE</td>
<td>dx=−1/2 β(t)xdt+β(t)dw</td>
<td>dx=d\[σ\^2(t)\]dw/dt</td>
</tr>
</table>
根据**定理3**， 由VE 的概率路径可得对应的速度场
$$
u_t(x|x_1)=-\frac{\sigma _{1-t}^{\prime}}{\sigma _{1-t}}(x-x_1).
$$
其中 \(\mu_t(x_1)=x_1\) 和 \(\sigma_t(x_1)=\sigma_{1-t}\)
对应的 VP 的概率路径对应的速度场为：
$$
u_t(x|x_1)=\frac{\alpha _{1-t}^{\prime}}{1-\alpha _{1-t}^{2}}\left( \alpha _{1-t}x-x_1 \right) =-\frac{T^{\prime}(1-t)}{2}\left[ \frac{e^{-T(1-t)}x-e^{-\frac{1}{2}T(1-t)}x_1}{1-e^{-T(1-t)}} \right] 
$$
其中由于 VP SDE 的概率路径为
$$
p_t(x|x_1)=\mathcal{N} (x|\alpha _{1-t}x_1,\left( 1-\alpha _{1-t}^{2} \right) I),\mathrm{where}\alpha _t=e^{-\frac{1}{2}T(t)},T(t)=\int_0^t{\beta (s)ds,}
$$
此时 \(\mu_t(x_1)=\alpha_{1-t}x_1\) 和 \(\sigma_t(x_1)=\sqrt{1-\alpha_{1-t}^2}\)
### Optimal Transport conditional VFs
理论上存在无限多种可能的向量场可以将 \(p_0\) 变换到 \(p_1\) 。哪一种是“最好”或者“最自然”的呢？
Optimal Transport (最优传输) 理论恰好回答了这个问题。
**位移插值 (Displacement Interpolation)**：当代价函数是距离的平方时，OT理论给出了一个非常优美的结果：最优的传输路径是**直线**。也就是说，对于从 \(p_0\) 中抽取的样本 \(x_0\) 和其在 \(p_1\) 中匹配的样本 \(x_1\)，它们之间的“最优”轨迹就是一条直线：
$$
\psi _t(x)=(1-(1-\sigma _{\min})t)x+tx_1
$$
那么此时这个路径上的速度场可以为：
$$
v_t(x_t|x_0,x_1)=\frac{dx_t}{dt}=\left( x_1-\left( 1-\sigma _{min} \right) x_0 \right)
$$
那么对应的损失函数为：
$$
\mathcal{L} _{\mathrm{CFM}}(\theta )=\mathbb{E} _{t,q(x_1),p(x_0)}\bigl\| v_t(\psi _t(x_0))- \bigr( x_1-(1-\sigma _{\min})x_0\bigl)  \bigr\| ^2.
$$
---
### 优势一：训练过程更稳定、更鲁棒 (more stable and robust)
- **内容**：作者提到，将他们的条件向量场（conditional VF）与Flow Matching的目标函数相结合，提供了一种新的训练方式。在他们的实验中，这种新方式比现有的得分匹配（score matching）方法**更稳定、更鲁棒**。
- **解释**：
	- **得分匹配 (Score Matching)** 的目标是让神经网络学习一个非常复杂的东西：对数概率密度的梯度 \(\nabla_x\log p_t(x)\)。这个“得分”在数据稀疏的区域可能变得非常大或不稳定，导致神经网络训练困难。
	- **Flow Matching** 的目标则简单得多：它是一个直接的**回归任务**。如我们之前讨论的，它让网络学习一个向量 \(x_1-\left( 1-\sigma _{min} \right) x_0\) 。预测一个具体的向量通常比预测一个抽象的、可能无界的“得分”要容易得多，因此训练过程更加稳定。
---
### 优势二：对概率路径的完全控制，摆脱了近似
这是更关键的一个理论优势。
- **内容**：作者指出，在旧的扩散模型中，所谓的\*\*“概率路径” (probability paths)\*\* 是由一个扩散过程（SDE）的解来定义的。这种路径有一个理论上的缺陷：它在**有限时间内无法真正到达一个纯粹的噪声分布**。因此，在实际操作中，人们不得不将初始的噪声分布 \(p_0(x)\) **近似地 (approximated)** 当作一个理想的**高斯分布 (Gaussian distribution)** 来进行采样。
- **解释**：
	- **旧方法的局限**：无论是VP-SDE还是VE-SDE，它们描述的都是一个渐近过程。也就是说，只有当时间 \(t\to\infty\) 时，数据分布才会“完美地”变成高斯噪声。但在实践中，我们只能模拟有限的时间 T（比如 \(T=1\)）。所以在 \(t=T\) 时刻的分布 \(p_T(x)\) 并非一个完美的、我们熟知的标准高斯分布 \(N(0,I)\)。但为了能从中采样，我们只能**假设/近似**它就是 \(N(0,I)\)。这在理论上不够优雅，是一种妥协。
	- **新方法的优越性**：Flow Matching框架摆脱了这种限制。它不是从一个固定的SDE出发，而是直接定义两个端点分布：\(p_0\)（噪声）和 \(p_1\)（数据）。我们可以**主动地、精确地**将 \(p_0\) 就设为我们想要的任何分布，比如一个完美的标准高斯分布。然后，我们可以**完全掌控 (full control)** 连接这两个分布的路径，比如通过设置路径上任意时刻 \(t\)的均值 \(\mu_t\) 和方差 \(\sigma_t\) 来精确定义它（例如OT路径就是一种精确定义）。
### 总结
总的来说，这段话的作用是**强调新方法的优越性**：
1. **实践上**：训练目标更简单，导致训练过程更稳定、效果更可靠。
2. **理论上**：设计更灵活、更精确。它不需要像老方法那样对终点（噪声）分布进行“近似处理”，而是可以直接定义一个完美的噪声分布和一条清晰的、可完全控制的路径，使得整个框架的理论基础更加坚实和优雅。

> 注：Notion 中的图片链接是临时资源，未直接复制；公式在网页中由 MathJax 渲染。

