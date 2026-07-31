> 原始笔记：DDPM
> 来源：[Notion 页面](https://app.notion.com/p/21a76ad5de008081a34ae41d857d8938)
>
作者：陈栩钧
---
# 概括
两个过程：前向过程（加噪）、反向过程（去噪)

**前向过程 (Forward Process)** 不断地对真实数据添加噪声，直到其完全变成随机噪声；(训练）
**反向过程 (Reverse Process)**，从纯粹的随机噪声出发，一步步地“去噪”，最终“雕刻”出一个全新的、清晰的数据样本。（推理）
---
一张清晰的照片（真实数据），你不断地往上面撒沙子（加噪声），直到照片完全被沙子覆盖（随机噪声）。现在，扩散模型的任务就是学习如何智能地、一步步地把沙子吹走（去噪），最终复原出一张从未见过但同样清晰真实的照片。

# 前向过程 (Forward Process) - “破坏”的过程
**操作:**
在每一个时间步 \(t\)，我们都在上一步的图像 \(x_{t−1}\)上添加少量的高斯噪声，得到 \(x_t\).
**数学表达: **\(q(x_t | x_{t-1}) = \mathcal{N}(x_t; \sqrt{1 - \beta_t} x_{t-1}, \beta_t \mathbf{I})\)
这里的 \(\beta_t\)是一个预先设定的、非常小的常数，控制每一步添加噪声的量。 \(\mathcal{N}\) 代表正态分布
**特点：**
- **马尔可夫性: **每一步的 \(x_t\) 只依赖于它的前一步 \(x_{t-1}\)
- **无需学习:** 噪声的添加方式是预先定义好的，就像一个固定的物理“扩散”过程
- **重要推论: **由于这个过程的简洁性，我们可以推导出一个公式，直接从原始图像 \(x_0\) 一步跳到任意中间步骤  \(x_t\) ，而无需迭代计算。这在训练时至关重要。
$$
x_t = \sqrt{\bar{\alpha}_t} x_0 + \sqrt{1 - \bar{\alpha}_t} \epsilon 
$$
其中\(\epsilon\)是随机噪声，\(\alpha_t\) 是基于所有 \(\beta\) 计算出的一个常数。这个公式告诉我们：
**任何一个加噪的中间状态**\(x_t\) **，都可以看作是原始图像 ** \(x_0\)** 和一个随机噪声的加权和.**

#  反向过程 (Reverse Process) - “创造”的过程
从一个纯噪声 \(x_T\) 开始，逐步地去除噪声，最终得到一张清晰的图像 \(x_0\)
- **挑战: **直接计算  \(q(x_{t-1} | x_{t})\) 是极其困难的（数学上称为intractable），因为它需要知道整个数据集的分布。基于贝叶斯公式最终结果如下：
$$
\begin{aligned}	q\boldsymbol{(x}_{\boldsymbol{t}-\boldsymbol{1}}|\boldsymbol{x}_{\boldsymbol{t}},\boldsymbol{x}_{\boldsymbol{0}}\boldsymbol{)}&=\boldsymbol{(x}_{\boldsymbol{t}-\boldsymbol{1}};\tilde{\boldsymbol{\mu}}\left( x_t,x_0 \right) ,\tilde{\boldsymbol{\beta}}_{\boldsymbol{t}}\boldsymbol{I)}\\	\boldsymbol{where}&\sim \tilde{\boldsymbol{\mu}}_{\boldsymbol{t}}=\frac{\boldsymbol{1}}{\sqrt{\boldsymbol{\alpha }_{\boldsymbol{t}}}}\left( x_t-\frac{\beta _t}{\sqrt{1-\overline{\alpha }_t}}\overline{z}_t \right)\\	\qquad \qquad &\sim \tilde{\beta}_t=\frac{1-\overline{\alpha }_{t-1}}{1-\overline{\alpha }_t}\cdot \beta _t\\\end{aligned}
$$
公式推导：
$$
\begin{aligned} q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t, \mathbf{x}_0\right) & =\frac{q\left(\mathbf{x}_{t-1}, \mathbf{x}_t, \mathbf{x}_0\right)}{q\left(\mathbf{x}_t, \mathbf{x}_0\right)} \\ & =\frac{q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}, \mathbf{x}_0\right) q\left(\mathbf{x}_{t-1}, \mathbf{x}_0\right)}{q\left(\mathbf{x}_t, \mathbf{x}_0\right)} \\ & =\frac{q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}, \mathbf{x}_0\right) q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_0\right)}{q\left(\mathbf{x}_t \mid \mathbf{x}_0\right)}, \\ &\quad \left(q(\mathbf{x}_t \mid \mathbf{x}_{t-1}, \mathbf{x}_0) \sim \mathcal{N}(\mathbf{x}_t; \sqrt{\alpha_t}\mathbf{x}_{t-1}, (1- \alpha_t)\boldsymbol{\mathcal{I}})\right) \\ &\quad \left(q(\mathbf{x}_{t-1} \mid \mathbf{x}_0) \sim \mathcal{N}(\mathbf{x}_{t-1}; \sqrt{\bar{\alpha}_{t-1}}\mathbf{x}_0, (1- \bar{\alpha}_{t-1})\boldsymbol{\mathcal{I}})\right) \\ &\quad \left(q(\mathbf{x}_t \mid \mathbf{x}_0) \sim \mathcal{N}(\mathbf{x}_{t}; \sqrt{\bar{\alpha}_{t}}\mathbf{x}_0, (1- \bar{\alpha}_{t})\boldsymbol{\mathcal{I}})\right) \\ &\propto \exp\left\{-\frac{1}{2} \left[ \frac{\left(\mathbf{x}_t-\sqrt{\alpha_t}\mathbf{x}_{t-1}\right)^2}{1-\alpha_t} + \frac{\left(\mathbf{x}_{t-1}-\sqrt{\bar{\alpha}_{t-1}}\mathbf{x}_0\right)^2}{1- \bar{\alpha}_{t-1}} - \frac{\left(\mathbf{x}_t-\sqrt{\bar{\alpha}_{t}}\mathbf{x}_0\right)^2}{1- \bar{\alpha}_{t}}\right] \right\}\\ &= \exp\left\{-\frac{1}{2} \left[ \left( \frac{\alpha_t}{1-\alpha_t} + \frac{1}{1- \bar{\alpha}_{t-1}}\right) \mathbf{x}_{t-1}^2 -2 \left( \frac{\sqrt{\alpha_t}\mathbf{x}_t}{1-\alpha_t} + \frac{\sqrt{\bar{\alpha}_{t-1}}\mathbf{x}_0}{1- \bar{\alpha}_{t-1}}\right)\mathbf{x}_{t-1}+ C(\mathbf{x}_t, \mathbf{x}_0)\right] \right\}\\ &= \exp\left\{-\frac{1}{2} \left[ \frac{\mathbf{x}_{t-1}^2 - 2 \left( \frac{\sqrt{\alpha_t}\mathbf{x}_t}{1-\alpha_t} + \frac{\sqrt{\bar{\alpha}_{t-1}}\mathbf{x}_0}{1- \bar{\alpha}_{t-1}}\right) / \left( \frac{\alpha_t}{1-\alpha_t} + \frac{1}{1- \bar{\alpha}_{t-1}}\right)}{1/ \left( \frac{\alpha_t}{1-\alpha_t} + \frac{1}{1- \bar{\alpha}_{t-1}}\right) } + C(\mathbf{x}_t, \mathbf{x}_0) \right] \right\} \\ &= \exp\left\{-\frac{1}{2} \left[ \frac{\mathbf{x}_{t-1}^2 - 2 \left( \frac{\sqrt{\alpha_t} (1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t}\mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1}} (1-\alpha_t)}{1- \bar{\alpha}_t}\mathbf{x}_0 \right)}{\frac{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t}} + C(\mathbf{x}_t, \mathbf{x}_0)\right] \right\} \\ &= \exp\left\{-\frac{1}{2} \left[\frac{\left[ \mathbf{x}_{t-1} - \left( \frac{\sqrt{\alpha_t} (1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t}\mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1}} (1-\alpha_t)}{1- \bar{\alpha}_t}\mathbf{x}_0 \right) \right]^2}{\frac{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t}} + C'(\mathbf{x}_t, \mathbf{x}_0)\right] \right\} \\ &\sim \mathcal{N}\left(\mathbf{x}_{t-1}; \left( \frac{\sqrt{\alpha_t} (1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t}\mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1}} (1-\alpha_t)}{1- \bar{\alpha}_t}\mathbf{x}_0 \right), \frac{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t}\boldsymbol{\mathcal{I}} \right) \\ \end{aligned}
$$
此时 \(x_0\) 是未知的，根据前向公式 \(x_t = \sqrt{\bar{\alpha}_t} x_0 + \sqrt{1 - \bar{\alpha}_t} \epsilon\) ，得出 \(x_0\) 带入前向公式
$$
\begin{aligned} \boldsymbol{\mu}_t &= \frac{\sqrt{\alpha_t} (1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t}\mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1}} (1-\alpha_t)}{1- \bar{\alpha}_t}\mathbf{x}_0 \\ &= \left(\frac{\sqrt{\alpha_t} (1-\bar{\alpha}_{t-1})}{1- \bar{\alpha}_t} + \frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t)}{\sqrt{\bar{\alpha}_t}(1-\bar{\alpha}_t)} \right)\mathbf{x}_t - \frac{\sqrt{\bar{\alpha}_{t-1}}(1-\alpha_t) \sqrt{1-\bar{\alpha}_t}}{\sqrt{\bar{\alpha}_t}(1- \bar{\alpha}_t)}\boldsymbol{\epsilon} \\ &= \frac{1}{\sqrt{\alpha_t}} \left( \mathbf{x}_t - \frac{1-\alpha_t}{\sqrt{1-\bar{\alpha}_t}}\boldsymbol{\epsilon} \right) \end{aligned}
$$
同时方差 \(\sigma_t^2=\frac{(1−\bar{\alpha}_{t-1})}{1−\bar{\alpha}_t}(1−\alpha_t)\)
最终有
$$
\begin{aligned} q(\mathbf{x}_{t-1} \mid \mathbf{x}_t) &\sim \mathcal{N}\left(\mathbf{x}_{t-1}; \boldsymbol{\mu}_t(\mathbf{x}_t), \boldsymbol{\sigma}^2_t\right) \\ &= \mathcal{N}\left(\mathbf{x}_{t-1}; \frac{1}{\sqrt{\alpha_t}}\left( \mathbf{x}_t - \frac{1-\alpha_t}{\sqrt{1-\bar{\alpha}_t}}\boldsymbol{\epsilon} \right), \frac{(1-\bar{\alpha}_{t-1})(1-\alpha_t)}{1- \bar{\alpha}_t} \boldsymbol{\mathcal{I}}\right) \end{aligned}
$$
# 似然函数
## 核心思想：哪个故事最能解释你看到的事实？
想象一下，你是一位侦探，来到一个案发现场，地上有一个弹孔。你手头有两把嫌疑枪，一把是A型号手枪，一把是B型号步枪。你的任务是判断这个弹孔是哪把枪造成的。
- **数据 (Data):** 你观察到的事实——地上的弹孔。
- **模型 (Model):** 能造成这个弹孔的两种可能“模型”——A型号手枪和B型号步枪。每个模型都有自己的参数（比如枪的口径、子弹初速等）。
- **似然函数 (Likelihood Function):** 一个评估函数。它会告诉你：“**假设**这个弹孔是A枪造成的，这种情况有多大的可能性？”以及“**假设**这个弹孔是B枪造成的，这种情况又有多大的可能性？”
如果你发现，根据A枪的特性，它打出这种弹孔的可能性非常高；而根据B枪的特性，它几乎不可能打出这种弹孔。作为侦探，你自然会得出结论：这个弹孔**最有可能**是A枪造成的。
这个过程就是最大似然估计。**“似然”指的是模型的参数与我们观测到的数据之间的“相似”或“契合”程度。**

## **似然函数是什么？**
**似然函数是关于统计模型中参数的函数，它衡量在给定模型参数下，观察到现有数据的“可能性”**。
拆解一下这句话：
- **统计模型：** 我们通常会假设数据服从某种概率分布，比如正态分布、泊松分布、伯努利分布等。这些分布都有自己的参数，比如正态分布的均值 (μ) 和方差 (σ2)，伯努利分布的成功概率 (p)。
- **模型参数：** 这些就是我们想要估计的未知数值，它们决定了数据分布的具体形状。
- **观察到的数据：** 这是我们通过实验或收集得到的一组实际数据样本。
- **“可能性” (Likelihood)：** 这是似然函数的核心概念。它不是一个概率，但和概率密切相关。

## **似然函数和概率密度函数 (PDF) 或概率质量函数 (PMF) 的区别：**
- **概率密度/质量函数 **\(P(x∣\theta)\)**：** 在**参数 θ 已知**的情况下，描述**数据 x 出现的概率**（或概率密度）。它的变量是数据 x，参数 θ 是固定的。所有可能的 x 的概率（密度）加起来或积分起来必须为 1。
- **似然函数 **\(L(\theta∣x)\)**：** 在**观察到数据 x 已知**的情况下，描述**不同参数 θ 值下观察到这些数据的“可能性”**。它的变量是参数 θ，数据 x 是固定的观测值。似然函数不需要满足积分或求和为 1 的条件。

# ELBO 变分下界推导过程
## 第一种分解方式：
$$
\begin{align*}\log p(\mathbf{x}) &= \log \int p(\mathbf{x}_{0:T}) d\mathbf{x}_{1:T} \\&= \log \int p(\mathbf{x}_{0:T}) \frac{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}{q(\mathbf{x}_{1:T}|\mathbf{x}_0)} d\mathbf{x}_{1:T} \\&= \log \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\frac{p(\mathbf{x}_{0:T})}{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\right] \\&\ge \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_{0:T})}{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T) \prod_{t=1}^{T} p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{ \prod_{t=1}^T q(\mathbf{x}_t|\mathbf{x}_{t-1})}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T) p_\theta(\mathbf{x}_0|\mathbf{x}_1) \prod_{t=2}^{T} p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_T|\mathbf{x}_{T-1}) \prod_{t=1}^{T-1} q(\mathbf{x}_t|\mathbf{x}_{t-1})}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p_\theta(\mathbf{x}_0|\mathbf{x}_1)}{1} + \log \frac{p(\mathbf{x}_T)}{q(\mathbf{x}_T|\mathbf{x}_{T-1})} + \sum_{t=2}^{T}\log\frac{p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_{t-1}|\mathbf{x}_{t-2})}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1)] + \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T)}{q(\mathbf{x}_T|\mathbf{x}_{T-1})}\right] + \sum_{t=1}^{T-1} \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p_\theta(\mathbf{x}_{t}|\mathbf{x}_{t+1})}{q(\mathbf{x}_t|\mathbf{x}_{t-1})}\right] \\&= \mathbb{E}_{q(\mathbf{x}_1|\mathbf{x}_0)}[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1)] + \mathbb{E}_{q(\mathbf{x}_{T-1}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T)}{q(\mathbf{x}_T|\mathbf{x}_{T-1})} \right] + \sum_{t=1}^{T-1} \mathbb{E}_{q(\mathbf{x}_{t-1}, \mathbf{x}_{t+1}|\mathbf{x}_0)}\left[\log \frac{p_\theta(\mathbf{x}_t|\mathbf{x}_{t+1})}{q(\mathbf{x}_t|\mathbf{x}_{t-1})} \right] \\&= \mathbb{E}_{q(\mathbf{x}_1|\mathbf{x}_0)}[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1)] - \mathbb{E}_{q(\mathbf{x}_{T-1}|\mathbf{x}_0)}[D_{KL}(q(\mathbf{x}_T|\mathbf{x}_{T-1}) || p(\mathbf{x}_T))] - \sum_{t=1}^{T-1} \mathbb{E}_{q(\mathbf{x}_{t-1},\mathbf{x}_{t+1}|\mathbf{x}_0)}[D_{KL}(q(\mathbf{x}_t|\mathbf{x}_{t-1}) || p_\theta(\mathbf{x}_t|\mathbf{x}_{t+1}))] \\&= \underbrace{\mathbb{E}_{q(\mathbf{x}_1|\mathbf{x}_0)}[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1)]}_{\text{reconstruction term}} - \underbrace{\mathbb{E}_{q(\mathbf{x}_{T-1}|\mathbf{x}_0)}[D_{KL}(q(\mathbf{x}_T|\mathbf{x}_{T-1}) || p(\mathbf{x}_T))]}_{\text{prior matching term}} - \underbrace{\sum_{t=1}^{T-1} \mathbb{E}_{q(\mathbf{x}_{t-1},\mathbf{x}_{t+1}|\mathbf{x}_0)}[D_{KL}(q(\mathbf{x}_t|\mathbf{x}_{t-1}) || p_\theta(\mathbf{x}_t|\mathbf{x}_{t+1}))]}_{\text{consistency term}}\end{align*}
$$
- **reconstruction: **用噪声分布计算从 \(x_1\) 到 \(x_0\) 的对数似然
- **prior matching: **不用训练，随着 timesteps 增大，可以让 \(D_{KL}=0\)
- **consistency**: 保证前向和方向过程一致（例如： \(q(x_t|x_{t-1})\) 与 \(p_{\theta}(x_{t+1}|x_{t})\)
> [Notion 图片已省略：原链接为临时地址]

## 第二种分解方式：
$$
\begin{align*}\log p(\mathbf{x}) &\ge \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_{0:T})}{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T) \prod_{t=1}^T p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{\prod_{t=1}^T q(\mathbf{x}_t|\mathbf{x}_{t-1})}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T) p_\theta(\mathbf{x}_0|\mathbf{x}_1) \prod_{t=2}^T p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_1|\mathbf{x}_0) \prod_{t=2}^T q(\mathbf{x}_t|\mathbf{x}_{t-1})}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T) p_\theta(\mathbf{x}_0|\mathbf{x}_1)}{q(\mathbf{x}_1|\mathbf{x}_0)} + \sum_{t=2}^T \log \frac{p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_t|\mathbf{x}_{t-1})}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T) p_\theta(\mathbf{x}_0|\mathbf{x}_1)}{q(\mathbf{x}_1|\mathbf{x}_0)} + \sum_{t=2}^T \log \frac{p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_{t-1}|\mathbf{x}_t, \mathbf{x}_0)q(\mathbf{x}_t|\mathbf{x}_0)/q(\mathbf{x}_{t-1}|\mathbf{x}_0)}\right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log \frac{p(\mathbf{x}_T)p_\theta(\mathbf{x}_0|\mathbf{x}_1)}{q(\mathbf{x}_T|\mathbf{x}_0)} + \sum_{t=2}^T \log \frac{p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_{t-1}|\mathbf{x}_t,\mathbf{x}_0)} \right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log\frac{p(\mathbf{x}_T)}{q(\mathbf{x}_T|\mathbf{x}_0)} + \log p_\theta(\mathbf{x}_0|\mathbf{x}_1) + \sum_{t=2}^T \log \frac{p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_{t-1}|\mathbf{x}_t,\mathbf{x}_0)} \right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1) - \log\frac{q(\mathbf{x}_T|\mathbf{x}_0)}{p(\mathbf{x}_T)} + \sum_{t=2}^T \log \frac{p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_{t-1}|\mathbf{x}_t,\mathbf{x}_0)} \right] \\&= \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1)\right] + \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[-\log\frac{q(\mathbf{x}_T|\mathbf{x}_0)}{p(\mathbf{x}_T)}\right] + \sum_{t=2}^T \mathbb{E}_{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\left[\log\frac{p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)}{q(\mathbf{x}_{t-1}|\mathbf{x}_t,\mathbf{x}_0)}\right] \\&= \mathbb{E}_{q(\mathbf{x}_0,\mathbf{x}_1)}[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1)] - \mathbb{E}_{q(\mathbf{x}_0,\mathbf{x}_T)}[D_{KL}(q(\mathbf{x}_T|\mathbf{x}_0) || p(\mathbf{x}_T))] + \sum_{t=2}^T \mathbb{E}_{q(\mathbf{x}_0,\mathbf{x}_t)}[D_{KL}(q(\mathbf{x}_{t-1}|\mathbf{x}_t,\mathbf{x}_0) || p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t))] \\&= \underbrace{\mathbb{E}_{q(\mathbf{x}_0, \mathbf{x}_1)}[\log p_\theta(\mathbf{x}_0|\mathbf{x}_1)]}_{\text{reconstruction term}} - \underbrace{D_{KL}(q(\mathbf{x}_T|\mathbf{x}_0) || p(\mathbf{x}_T))}_{\text{prior matching term}} - \underbrace{\sum_{t=2}^T \mathbb{E}_{q(\mathbf{x}_0, \mathbf{x}_t)}[D_{KL}(q(\mathbf{x}_{t-1}|\mathbf{x}_t, \mathbf{x}_0) || p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t))]}_{\text{denoising matching term}}\end{align*}
$$
- **Reconstruction Term (重建项):** 对应于在去噪的最后一步，从 \(x_1\) 中恢复出原始图像 \(x_0\)  的能力。这类似于 VAE 中的重建损失。
- **Prior Matching Term (先验匹配项):** 确保在加噪过程的最后一步，数据的分布 \(q(x_T|x_0)\) 与模型假设的先验分布 \(p(x_T)\)（通常是标准正态分布）相匹配。
- **Denoising Matching Term (去噪匹配项):** 这是核心部分，包含了从 \(t=T-1\) 到 \(t=1\) 的所有中间去噪步骤。它要求模型学习的逆向过程分布 \(p_θ(x_{t-1}|x_t)\) 要与真实（但难以计算）的后验分布 \(q(x_{t-1}|x_t, x_0)\) 相匹配。通过对这一项的进一步简化，最终可以推导出让模型去预测噪声 \(ε\) 的均方误差损失函数。
> [Notion 图片已省略：原链接为临时地址]

# 优化目标的转化
## 第一种：
$$
\begin{align*}& \arg\min_{\theta} D_{KL}(q(\mathbf{x}_{t-1}|\mathbf{x}_t, \mathbf{x}_0) \ || \ p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)) \\&= \arg\min_{\theta} D_{KL}(\mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_q, \boldsymbol{\Sigma}_q(t)) \ || \ \mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_\theta, \boldsymbol{\Sigma}_\theta(t))) \\&= \arg\min_{\theta} \frac{1}{2} \left[ \log \frac{|\boldsymbol{\Sigma}_\theta(t)|}{|\boldsymbol{\Sigma}_q(t)|} - d + \text{tr}(\boldsymbol{\Sigma}_q(t)^{-1}\boldsymbol{\Sigma}_\theta(t)) + (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q)^T \boldsymbol{\Sigma}_q(t)^{-1} (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q) \right] \\&= \arg\min_{\theta} \frac{1}{2} \left[ \log 1 - d + d + (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q)^T \boldsymbol{\Sigma}_q(t)^{-1} (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q) \right] \\&= \arg\min_{\theta} \frac{1}{2} \left[ (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q)^T \boldsymbol{\Sigma}_q(t)^{-1} (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q) \right] \\&= \arg\min_{\theta} \frac{1}{2} \left[ (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q)^T (\sigma_q^2(t)\mathbf{I})^{-1} (\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q) \right] \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \left[ ||\boldsymbol{\mu}_\theta - \boldsymbol{\mu}_q||_2^2 \right]\end{align*}
$$
## 第二种：
将均值 \(\mu_q\) 和 \(\mu_\theta\) 带入 
$$
\boldsymbol{\mu}_q(\mathbf{x}_t, \mathbf{x}_0) = \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})\mathbf{x}_t + \sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\mathbf{x}_0}{1 - \bar{\alpha}_t}
$$
$$
\boldsymbol{\mu}_\theta(\mathbf{x}_t, t) = \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})\mathbf{x}_t + \sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\hat{\mathbf{x}}_\theta(\mathbf{x}_t, t)}{1 - \bar{\alpha}_t}
$$
有
$$
\begin{align*}& \arg\min_{\theta} D_{KL}(q(\mathbf{x}_{t-1}|\mathbf{x}_t, \mathbf{x}_0) \ || \ p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)) \\&= \arg\min_{\theta} D_{KL}(\mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_q, \boldsymbol{\Sigma}_q(t)) \ || \ \mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_\theta, \boldsymbol{\Sigma}_\theta(t))) \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \left\| \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})\mathbf{x}_t + \sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\hat{\mathbf{x}}_\theta(\mathbf{x}_t, t)}{1 - \bar{\alpha}_t} - \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})\mathbf{x}_t + \sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\mathbf{x}_0}{1 - \bar{\alpha}_t} \right\|_2^2 \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \left\| \frac{\sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\hat{\mathbf{x}}_\theta(\mathbf{x}_t, t)}{1 - \bar{\alpha}_t} - \frac{\sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\mathbf{x}_0}{1 - \bar{\alpha}_t} \right\|_2^2 \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \left\| \frac{\sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)}{1 - \bar{\alpha}_t} (\hat{\mathbf{x}}_\theta(\mathbf{x}_t, t) - \mathbf{x}_0) \right\|_2^2 \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \frac{\bar{\alpha}_{t-1}(1 - \alpha_t)^2}{(1 - \bar{\alpha}_t)^2} \left\| \hat{\mathbf{x}}_\theta(\mathbf{x}_t, t) - \mathbf{x}_0 \right\|_2^2\end{align*}
$$
## 第三种：
基于前向公式，有
$$
\mathbf{x}_0 = \frac{\mathbf{x}_t - \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_0}{\sqrt{\bar{\alpha}_t}}
$$
带均值公式
$$
\begin{align*}\boldsymbol{\mu}_q(\mathbf{x}_t, \mathbf{x}_0) &= \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})\mathbf{x}_t + \sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\mathbf{x}_0}{1 - \bar{\alpha}_t} \\&= \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})\mathbf{x}_t + \sqrt{\bar{\alpha}_{t-1}}(1 - \alpha_t)\frac{\mathbf{x}_t - \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_0}{\sqrt{\bar{\alpha}_t}}}{1 - \bar{\alpha}_t} \\&= \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})\mathbf{x}_t + (1 - \alpha_t)\frac{\mathbf{x}_t - \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_0}{\sqrt{\alpha_t}}}{1 - \bar{\alpha}_t} \\&= \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})}{1 - \bar{\alpha}_t}\mathbf{x}_t + \frac{(1 - \alpha_t)\mathbf{x}_t}{(1 - \bar{\alpha}_t)\sqrt{\alpha_t}} - \frac{(1 - \alpha_t)\sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_0}{(1 - \bar{\alpha}_t)\sqrt{\alpha_t}} \\&= \left( \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})}{1 - \bar{\alpha}_t} + \frac{1 - \alpha_t}{(1 - \bar{\alpha}_t)\sqrt{\alpha_t}} \right) \mathbf{x}_t - \frac{(1 - \alpha_t)\sqrt{1 - \bar{\alpha}_t}}{(1 - \bar{\alpha}_t)\sqrt{\alpha_t}}\boldsymbol{\epsilon}_0 \\&= \left( \frac{\alpha_t(1 - \bar{\alpha}_{t-1}) + (1 - \alpha_t)}{(1 - \bar{\alpha}_t)\sqrt{\alpha_t}} \right) \mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\boldsymbol{\epsilon}_0 \\&= \frac{\alpha_t - \bar{\alpha}_t + 1 - \alpha_t}{(1 - \bar{\alpha}_t)\sqrt{\alpha_t}}\mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\boldsymbol{\epsilon}_0 \\&= \frac{1 - \bar{\alpha}_t}{(1 - \bar{\alpha}_t)\sqrt{\alpha_t}}\mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\boldsymbol{\epsilon}_0 \\&= \frac{1}{\sqrt{\alpha_t}}\mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\boldsymbol{\epsilon}_0\end{align*}
$$
与之对应的网络matching 的均值假设为
$$
\boldsymbol{\mu}_\theta(\mathbf{x}_t, t) = \frac{1}{\sqrt{\alpha_t}}\mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\hat{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t, t)
$$
最终有：
$$
\begin{align*}& \arg\min_{\theta} D_{KL}(q(\mathbf{x}_{t-1}|\mathbf{x}_t, \mathbf{x}_0) \ || \ p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)) \\&= \arg\min_{\theta} D_{KL}(\mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_q, \boldsymbol{\Sigma}_q(t)) \ || \ \mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_\theta, \boldsymbol{\Sigma}_\theta(t))) \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \left\| \left( \frac{1}{\sqrt{\alpha_t}}\mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\hat{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t, t) \right) - \left( \frac{1}{\sqrt{\alpha_t}}\mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\boldsymbol{\epsilon}_0 \right) \right\|_2^2 \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \left\| \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\boldsymbol{\epsilon}_0 - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}}\hat{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t, t) \right\|_2^2 \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \left\| \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}\sqrt{\alpha_t}} (\boldsymbol{\epsilon}_0 - \hat{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t, t)) \right\|_2^2 \\&= \arg\min_{\theta} \frac{1}{2\sigma_q^2(t)} \frac{(1 - \alpha_t)^2}{(1 - \bar{\alpha}_t)\alpha_t} \left\| \boldsymbol{\epsilon}_0 - \hat{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t, t) \right\|_2^2\end{align*}
$$

> 注：Notion 中的图片链接是临时资源，未直接复制；公式在网页中由 MathJax 渲染。

