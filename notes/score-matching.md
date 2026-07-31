# Score-based Models & Score Matching

> 一句话：不直接拟合未知密度 `p(x)`，而是学习 `log p(x)` 的梯度，也就是数据分布的局部方向场。

- 整理自 Notion 笔记：2025-07-02
- 原始笔记：[Score based Model & Score Mathcing](https://app.notion.com/p/22376ad5de00808284b0e78de416af99)

## 1. Score function

Score function 定义为：

$$
s_\theta(x)=\nabla_x\log p_\theta(x).
$$

如果把分布写成能量模型：

$$
p_\theta(x)=\frac{1}{Z_\theta}\exp\left(-f_\theta(x)\right),
$$

归一化常数 `Zθ` 通常很难计算，但对 `x` 求梯度时它会消失：

$$
\nabla_x\log p_\theta(x)=-\nabla_x f_\theta(x).
$$

因此，Score-based model 关注的不是密度的绝对值，而是“往哪里走，密度会变大”。

## 2. 理想目标与核心矛盾

理想情况下，希望最小化：

$$
\mathbb{E}_{p(x)}
\left[\left\|s_\theta(x)-\nabla_x\log p(x)\right\|_2^2\right].
$$

但真实的 `p(x)` 未知；如果知道它，学习这个模型本身就没有必要了。这就是 Score matching 要解决的核心矛盾：构造一个不需要显式计算真实 score、但最优解仍然一致的目标。

## 3. Explicit score matching

展开平方项并对交叉项做分部积分，在边界项消失的条件下，可以得到：

$$
\mathcal{L}_{\text{ESM}}(\theta)
=\mathbb{E}_{p(x)}
\left[\left\|s_\theta(x)\right\|_2^2
+2\,\mathrm{tr}\left(\nabla_xs_\theta(x)\right)\right].
$$

它不再显式包含 `∇ log p(x)`。不过，`tr(∇ₓsθ(x))` 需要计算网络输出对输入的 Jacobian trace；在高维数据上，这个二阶计算成本很高。

Notion 笔记还记录了 KDE（核密度估计）的路线：先用核函数近似 `p(x)`，再对近似密度计算 score。但高维、小样本时 KDE 的效果和效率都有限。

## 4. Denoising score matching

更实用的办法是给数据加噪。设：

$$
x= x' + \sigma z,\qquad z\sim\mathcal{N}(0,I),
$$

则高斯条件分布的 score 是已知的：

$$
\nabla_x\log q(x\mid x')=-\frac{x-x'}{\sigma^2}=-\frac{z}{\sigma}.
$$

于是 DSM 的训练目标为：

$$
\mathcal{L}_{\text{DSM}}
=\mathbb{E}_{x\sim p,\,z}
\left[
\frac12\left\|s_\theta(x+\sigma z)+\frac{z}{\sigma}\right\|_2^2
\right].
$$

它避开了显式的 Jacobian trace，只需要采样数据和高斯噪声即可训练。

## 5. Langevin dynamics

学到 score 后，可以用 Langevin dynamics 采样：

$$
x_{t+1}=x_t+\tau s_\theta(x_t)+\sqrt{2\tau}\,z_t,
\qquad z_t\sim\mathcal{N}(0,I).
$$

第一项沿着密度上升方向移动，第二项保留随机探索。它把“学到的方向场”转成了“从噪声走向数据的轨迹”。

## 6. NCSN：多噪声尺度

单个 `σ` 有明显取舍：太小只能看到局部细节，太大又会破坏局部结构。NCSN 使用一组从大到小的噪声水平，并将 `σ` 作为网络输入：

$$
\mathcal{L}_{\text{NCSN}}(\theta)
=\frac1L\sum_{i=1}^L\lambda(\sigma_i)\,\ell(\theta;\sigma_i).
$$

常见设置是 `λ(σᵢ)=σᵢ²`。采样时也按照从大到小的噪声顺序，逐级使用对应的 score。

## 7. 我的理解

Score matching 提供了一种几何视角：模型学习的是数据分布的“坡度图”。DDPM 的噪声过程、DSM 的加噪监督和 NCSN 的多尺度训练，最终都在帮助模型获得更可靠的 score field。

> Notion 中的图片使用了会过期的临时资源链接，因此这里没有直接复制图片 URL。
