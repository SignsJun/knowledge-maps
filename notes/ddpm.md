作者：陈栩钧

# 概括

DDPM（Denoising Diffusion Probabilistic Model）包含两个方向：

- **前向过程（Forward Process）**：不断给真实数据添加噪声，直到它接近纯随机噪声。
- **反向过程（Reverse Process）**：从纯噪声出发，一步步预测并去除噪声，最终得到一个全新的数据样本。

可以把它想象成一张清晰的照片不断被沙子覆盖。扩散模型要学习的，就是如何智能地、逐步地把沙子吹走。

# 前向过程（Forward Process）——“破坏”的过程

在每一个时间步 \(t\)，我们在 \(x_{t-1}\) 上添加少量高斯噪声，得到 \(x_t\)：

$$
q(x_t \mid x_{t-1}) =
\mathcal{N}\left(x_t;\sqrt{1-\beta_t}\,x_{t-1},\beta_t\mathbf{I}\right).
$$

其中，\(\beta_t\) 是预先设定的噪声强度。这个过程有三个特点：

- **马尔可夫性**：每一步的 \(x_t\) 只依赖前一步 \(x_{t-1}\)。
- **无需学习**：加噪方式固定，相当于一个预先定义好的扩散过程。
- **可以跳步采样**：不必逐步计算，就能从 \(x_0\) 直接构造任意时刻的 \(x_t\)。

令 \(\alpha_t=1-\beta_t\)，\(\bar{\alpha}_t=\prod_{s=1}^{t}\alpha_s\)，则：

$$
x_t=\sqrt{\bar{\alpha}_t}\,x_0+
\sqrt{1-\bar{\alpha}_t}\,\epsilon,
\qquad \epsilon\sim\mathcal{N}(0,\mathbf{I}).
$$

因此，任意中间状态 \(x_t\) 都可以看成原始数据 \(x_0\) 与随机噪声的加权和。这条公式也是训练高效的关键：随机采样 \(t\) 和 \(\epsilon\)，就能直接得到训练样本。

# 反向过程（Reverse Process）——“创造”的过程

反向过程从纯噪声 \(x_T\) 开始，逐步恢复出清晰的数据。困难在于，真实的反向后验 \(q(x_{t-1}\mid x_t)\) 依赖未知的数据分布，通常无法直接计算。

在给定 \(x_0\) 时，前向过程的后验仍然是高斯分布：

$$
q(x_{t-1}\mid x_t,x_0)
=
\mathcal{N}\left(x_{t-1};
\tilde{\mu}_t(x_t,x_0),
\tilde{\beta}_t\mathbf{I}\right),
$$

其中：

$$
\tilde{\mu}_t
=
\frac{1}{\sqrt{\alpha_t}}
\left(
x_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\epsilon
\right),
\qquad
\tilde{\beta}_t
=
\frac{1-\bar{\alpha}_{t-1}}{1-\bar{\alpha}_t}\beta_t.
$$

实际模型用神经网络参数化反向转移：

$$
p_\theta(x_{t-1}\mid x_t)
=
\mathcal{N}\left(
x_{t-1};
\mu_\theta(x_t,t),
\Sigma_\theta(x_t,t)
\right).
$$

常见做法不是直接预测 \(x_0\)，而是让网络预测当前状态中的噪声：

$$
\epsilon_\theta(x_t,t)\approx\epsilon.
$$

# ELBO 与训练目标

DDPM 可以看作一个潜变量模型。为了最大化数据的对数似然 \(\log p_\theta(x_0)\)，引入前向过程 \(q(x_{1:T}\mid x_0)\) 作为变分分布。

## 从似然到变分下界

先插入 \(q(x_{1:T}\mid x_0)\) 与其倒数：

$$
\begin{aligned}
\log p_\theta(x_0)
&=
\log\int p_\theta(x_{0:T})\,\mathrm{d}x_{1:T} \\
&=
\log\int
q(x_{1:T}\mid x_0)
\frac{p_\theta(x_{0:T})}{q(x_{1:T}\mid x_0)}
\,\mathrm{d}x_{1:T} \\
&=
\log\mathbb{E}_{q(x_{1:T}\mid x_0)}
\left[
\frac{p_\theta(x_{0:T})}{q(x_{1:T}\mid x_0)}
\right].
\end{aligned}
$$

利用 Jensen 不等式 \(\log\mathbb{E}[X]\geq\mathbb{E}[\log X]\)，得到：

$$
\log p_\theta(x_0)
\geq
\mathbb{E}_{q(x_{1:T}\mid x_0)}
\left[
\log
\frac{p_\theta(x_{0:T})}{q(x_{1:T}\mid x_0)}
\right].
$$

右侧就是 ELBO。训练时最大化 ELBO，等价于最小化负的 ELBO。

## 利用扩散过程分解联合分布

反向模型与前向过程分别满足：

$$
p_\theta(x_{0:T})
=
p(x_T)
\prod_{t=1}^{T}
p_\theta(x_{t-1}\mid x_t),
$$

$$
q(x_{1:T}\mid x_0)
=
\prod_{t=1}^{T}
q(x_t\mid x_{t-1}).
$$

将它们代入 ELBO，并把 \(t=1\) 的重建项、\(t=T\) 的先验项以及中间去噪项分开：

$$
\begin{aligned}
\log p_\theta(x_0)
\geq\;&
\mathbb{E}_{q}
\left[
\log p_\theta(x_0\mid x_1)
\right] \\
&-
D_{\mathrm{KL}}
\left(
q(x_T\mid x_0)\,\|\,p(x_T)
\right) \\
&-
\sum_{t=2}^{T}
\mathbb{E}_{q}
\left[
D_{\mathrm{KL}}
\left(
q(x_{t-1}\mid x_t,x_0)
\,\|\,
p_\theta(x_{t-1}\mid x_t)
\right)
\right].
\end{aligned}
$$

如果定义负 ELBO 为训练损失，就有：

$$
\mathcal{L}_{\mathrm{ELBO}}
=
\underbrace{
D_{\mathrm{KL}}\left(q(x_T\mid x_0)\,\|\,p(x_T)\right)
}_{\mathcal{L}_T\text{：先验匹配}}
+
\sum_{t=2}^{T}
\underbrace{
\mathbb{E}_{q}
\left[
D_{\mathrm{KL}}
\left(
q(x_{t-1}\mid x_t,x_0)
\,\|\,
p_\theta(x_{t-1}\mid x_t)
\right)
\right]
}_{\mathcal{L}_{t-1}\text{：去噪匹配}}
-
\underbrace{
\mathbb{E}_{q}
\left[
\log p_\theta(x_0\mid x_1)
\right]
}_{\mathcal{L}_0\text{：重建}}.
$$

因此，ELBO 的“等量变化”可以概括为：

$$
\mathcal{L}_{\mathrm{ELBO}}
=
\mathcal{L}_T
+
\sum_{t=2}^{T}\mathcal{L}_{t-1}
+
\mathcal{L}_0.
$$

三项分别对应：

- **先验匹配项**：让最后的噪声分布接近预设先验 \(p(x_T)\)。
- **去噪匹配项**：让模型的反向转移接近真实后验。
- **重建项**：让最后一步能够从 \(x_1\) 恢复 \(x_0\)。

## 从 KL 散度到噪声预测

在 DDPM 中，真实后验与模型反向分布都取高斯形式，并固定反向方差。真实后验的均值为：

$$
\tilde{\mu}_t(x_t,x_0)
=
\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}x_t
+
\frac{\sqrt{\bar{\alpha}_{t-1}}\beta_t}{1-\bar{\alpha}_t}x_0.
$$

由前向过程：

$$
x_0
=
\frac{x_t-\sqrt{1-\bar{\alpha}_t}\,\epsilon}
{\sqrt{\bar{\alpha}_t}},
$$

代回上式，可以得到只依赖 \(x_t\) 和噪声 \(\epsilon\) 的形式：

$$
\tilde{\mu}_t(x_t,x_0)
=
\frac{1}{\sqrt{\alpha_t}}
\left(
x_t
-
\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\epsilon
\right).
$$

模型则用 \(\epsilon_\theta(x_t,t)\) 替代真实噪声：

$$
\mu_\theta(x_t,t)
=
\frac{1}{\sqrt{\alpha_t}}
\left(
x_t
-
\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}
\epsilon_\theta(x_t,t)
\right).
$$

两个同方差高斯分布之间的 KL 散度，关于 \(\theta\) 的部分只剩均值差：

$$
D_{\mathrm{KL}}
\left(
q\,\|\,p_\theta
\right)
=
\frac{1}{2\tilde{\beta}_t}
\left\|
\tilde{\mu}_t-\mu_\theta
\right\|_2^2
+
C.
$$

代入上面的均值表达式：

$$
D_{\mathrm{KL}}
\left(
q\,\|\,p_\theta
\right)
=
\frac{\beta_t^2}
{2\tilde{\beta}_t\alpha_t(1-\bar{\alpha}_t)}
\left\|
\epsilon-\epsilon_\theta(x_t,t)
\right\|_2^2
+
C.
$$

也就是说，在忽略只依赖时间步 \(t\) 的权重以及常数项后，ELBO 的去噪匹配项就转化为了噪声预测的均方误差：

$$
\mathcal{L}_{\mathrm{simple}}
=
\mathbb{E}_{x_0,\epsilon,t}
\left[
\left\|
\epsilon-\epsilon_\theta(x_t,t)
\right\|_2^2
\right].
$$

这就是 DDPM 论文和实际实现中最常见的训练目标。

# 采样流程

1. 从 \(x_T\sim\mathcal{N}(0,\mathbf{I})\) 开始。
2. 对 \(t=T,T-1,\ldots,1\)，输入 \((x_t,t)\)，预测噪声 \(\epsilon_\theta(x_t,t)\)。
3. 根据 \(p_\theta(x_{t-1}\mid x_t)\) 采样下一步。
4. 最终得到 \(x_0\)。

# 我的理解

DDPM 的核心不是让网络一次性“画出”一张图，而是把一个困难的生成任务拆成许多个局部去噪任务：在当前噪声水平下，下一步应该往哪里走。噪声日程、时间条件化和采样步数，共同决定了最终的质量与速度。

