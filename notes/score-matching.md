作者：陈栩钧

# 概述

Score-based model 的建模对象不是概率密度本身，而是 \(\log p(x)\) 的梯度，也就是 **score function**。由于真实 score 通常无法直接计算，Score matching 构造了一个可训练的替代目标。

# Score function 与 Score-based Models

## Score function

$$
s_\theta(\mathbf{x})
=
\nabla_{\mathbf{x}}\log p_\theta(\mathbf{x}).
$$

Score 描述的是：在当前位置 \(\mathbf{x}\) 上，数据密度增长最快的方向。

## 能量方法

任意一个概率分布都可以写成能量模型：

$$
p_\theta(\mathbf{x})
=
\frac{1}{Z_\theta}
\exp\left(-f_\theta(\mathbf{x})\right),
$$

其中 \(f_\theta\) 可以由神经网络表示，\(Z_\theta\) 是归一化常数。虽然 \(Z_\theta\) 通常难以计算，但对 \(\mathbf{x}\) 求梯度时它会消失：

$$
\nabla_{\mathbf{x}}\log p_\theta(\mathbf{x})
=
-\nabla_{\mathbf{x}}f_\theta(\mathbf{x}).
$$

因此，Score-based model 只需要学习一个方向场，不必显式计算密度的绝对值。

# Score Matching

理想目标是让模型 score 接近真实 score：

$$
\mathcal{L}(\theta)
=
\mathbb{E}_{p(\mathbf{x})}
\left[
\left\|
\mathbf{s}_\theta(\mathbf{x})
-
\nabla_{\mathbf{x}}\log p(\mathbf{x})
\right\|_2^2
\right].
$$

问题在于，真实 \(p(\mathbf{x})\) 未知。Score matching 的目标，是构造一个不需要显式知道 \(p(\mathbf{x})\) 的等价优化问题。

展开平方项，并对交叉项做分部积分，在边界项消失的条件下，可以得到：

$$
\mathcal{L}_{\mathrm{ESM}}(\theta)
=
\mathbb{E}_{p(\mathbf{x})}
\left[
\left\|
\mathbf{s}_\theta(\mathbf{x})
\right\|_2^2
+
2\,\operatorname{tr}
\left(
\nabla_{\mathbf{x}}\mathbf{s}_\theta(\mathbf{x})
\right)
\right].
$$

这就是 **Explicit Score Matching**。它绕开了真实 score，但需要计算网络输出对输入的 Jacobian trace；在高维数据上，计算成本很高。

# Denoising Score Matching

为了避免 Jacobian trace，Denoising Score Matching（DSM）给真实数据添加已知噪声。设：

$$
\mathbf{x}
=
\mathbf{x}'
+
\sigma\mathbf{z},
\qquad
\mathbf{z}\sim\mathcal{N}(0,\mathbf{I}).
$$

条件分布 \(q(\mathbf{x}\mid\mathbf{x}')\) 是高斯分布，因此它的 score 可以直接计算：

$$
\nabla_{\mathbf{x}}\log q(\mathbf{x}\mid\mathbf{x}')
=
-\frac{\mathbf{x}-\mathbf{x}'}{\sigma^2}
=
-\frac{\mathbf{z}}{\sigma}.
$$

于是 DSM 的目标为：

$$
\mathcal{L}_{\mathrm{DSM}}(\theta)
=
\mathbb{E}_{p(\mathbf{x}),\mathbf{z}}
\left[
\frac{1}{2}
\left\|
\mathbf{s}_\theta(\mathbf{x}+\sigma\mathbf{z})
+
\frac{\mathbf{z}}{\sigma}
\right\|_2^2
\right].
$$

给定训练集 \(\{\mathbf{x}^{(m)}\}_{m=1}^{M}\)，可以用经验平均近似：

$$
\theta^*
=
\arg\min_\theta
\frac{1}{M}
\sum_{m=1}^{M}
\frac{1}{2}
\left\|
\mathbf{s}_\theta
\left(\mathbf{x}^{(m)}+\sigma\mathbf{z}^{(m)}\right)
+
\frac{\mathbf{z}^{(m)}}{\sigma}
\right\|_2^2.
$$

DSM 与 Explicit Score Matching 只相差一个与 \(\theta\) 无关的常数项：

$$
J_{\mathrm{DSM}}(\theta)
=
J_{\mathrm{ESM}}(\theta)+C.
$$

# Langevin dynamics

学到 score 后，可以使用 Langevin dynamics 进行采样：

$$
\mathbf{x}_{t+1}
=
\mathbf{x}_t
+
\tau\mathbf{s}_\theta(\mathbf{x}_t)
+
\sqrt{2\tau}\mathbf{z}_t,
\qquad
\mathbf{z}_t\sim\mathcal{N}(0,\mathbf{I}).
$$

梯度项将样本推向高密度区域，随机项帮助样本探索不同可能性。

# NCSN：噪声条件化与多尺度

单个噪声尺度存在取舍：

- \(\sigma\) 太小，模型主要看到局部高密度区域，难以跨越低密度区域。
- \(\sigma\) 太大，模型能学习全局结构，但会损失局部细节。

NCSN 使用从大到小的一组噪声水平 \(\{\sigma_1,\ldots,\sigma_L\}\)，并把噪声水平作为模型输入：

$$
\mathcal{L}_{\mathrm{NCSN}}(\theta)
=
\frac{1}{L}
\sum_{i=1}^{L}
\lambda(\sigma_i)\,
\ell(\theta;\sigma_i),
$$

其中：

$$
\ell(\theta;\sigma)
=
\mathbb{E}_{p(\mathbf{x})}
\left[
\frac{1}{2}
\left\|
\mathbf{s}_\theta(\mathbf{x}+\sigma\mathbf{z})
+
\frac{\mathbf{z}}{\sigma}
\right\|_2^2
\right].
$$

通常令 \(\lambda(\sigma_i)=\sigma_i^2\)，并按照从大到小的噪声顺序进行 Langevin 采样。

# 我的理解

Score matching 提供的是一个几何视角：模型学习的不是“这个点有多大概率”，而是“从这个点往哪里走，概率会变大”。DSM 让这个方向场可以被稳定地训练，NCSN 则通过多尺度噪声把全局结构与局部细节连接起来。

