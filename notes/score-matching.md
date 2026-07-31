> 原始笔记：Score based Model & Score Mathcing
> 来源：[Notion 页面](https://app.notion.com/p/22376ad5de00808284b0e78de416af99)
>
作者：陈栩钧
---
# 概述
Score based Modeld的建模对象是概率分布函数 \(\log\) 的梯度（即 **score function**），而 **score function **不能轻易被计算，故使用 **score matching **的方法进行**转化解决**。
---
# **Score Function 和 Score-based Models**
## **Score function**
**score function** 定义为：
$$
s_\theta(\mathbf{x}) = \nabla_\mathbf{x} \log p_\theta(\mathbf{x}) 
$$
## 能量方法
任意一个随机变量可以写成：
$$
p_{\theta}(\mathbf{x}) = \frac{1}{Z_{\theta}}e^{-f_{\theta}(\mathbf{x})}
$$
其中 \(f_\theta(\mathbf{x})\) 表示带有可学习参数 \(\theta\) 的函数（可以理解为某个神经网络）。因为 \(p_\theta\) 是概率分布函数，所以需要满足 \(\int p_\theta(\mathbf{x})d\mathbf{x} =1\)，所以需要引入一个与 \(\theta\) 有关的归一化参数 \(Z_\theta = \int e^{
−f_\theta(\mathbf{x})}d\mathbf{x}\)。

虽然不知道 \(Z_\theta\) 的具体数值，因为对于一个任意的分布来说，这个归一化系数的值通常是无法求得的。需要一些 **trick** 
$$
\begin{align*}\nabla_{\mathbf{x}} \log p_{\theta}(\mathbf{x}) &= \nabla_{\mathbf{x}} \log\left(\frac{1}{Z_{\theta}}e^{-f_{\theta}(\mathbf{x})}\right) \\&= \nabla_{\mathbf{x}} \log \frac{1}{Z_{\theta}} + \nabla_{\mathbf{x}} \log e^{-f_{\theta}(\mathbf{x})} \\&= -\nabla_{\mathbf{x}} f_{\theta}(\mathbf{x}) \\&\approx s_{\theta}(\mathbf{x})\end{align*}
$$
对应的优化函数为：
$$
\theta = \arg \min_{\theta} \mathbb{E}_{p(\mathbf{x})} \left[ \left\| \nabla_{\mathbf{x}} \log p(\mathbf{x}) - \mathbf{s}_{\theta}(\mathbf{x}) \right\|_2^2 \right]
$$
这个公式的目标很清晰：让我们的模型 \(s_{\theta}(\mathbf{x})\) 去逼近真实的分数 \(\nabla_{\mathbf{x}} \log p(\mathbf{x})\)。
**核心矛盾在于**：要计算这个损失，我们就必须知道真实分数，而要知道真实分数，我们就得知道 \(p(x)\)，可我们一开始的目标就是为了学习这个未知的 \(p(x)\)。则需要 **Score Matching**

# **Score Matching**
## 基本 **Score Matching**
**Score Matching 的使命**：设计出一个**新的、可计算的**目标函数，它必须满足以下两个条件：
1. 计算目标函数的过程中完全不需要知道 \(p(x)\) 或其导数。
2. 最小化目标函数的结果，与最小化上面那个理想目标函数的结果是**完全一样**的。
如果能找到这样的目标函数，我们就能绕开死循环，成功训练模型。
### 数学推导
$$
\begin{align*}& \left\| \nabla_{\mathbf{x}} \log p(\mathbf{x}) - \mathbf{s}_{\theta}(\mathbf{x}) \right\|_2^2 \\= & \underbrace{\left\| \nabla_{\mathbf{x}} \log p(\mathbf{x}) \right\|_2^2}_{\text{constant}} - 2 \left( \nabla_{\mathbf{x}} \log p(\mathbf{x}) \right)^{\top}  \mathbf{s}_{\theta}(\mathbf{x})  + \left\| \mathbf{s}_{\theta}(\mathbf{x}) \right\|_2^2\end{align*}
$$
第一项是常量，所以可以忽略，针对第二项
$$
\begin{align*}
& \quad -2 \int p(\mathbf{x}) (\nabla_{\mathbf{x}} \log p(\mathbf{x}))^{\top} \mathbf{s}_{\theta}(\mathbf{x}) \mathrm{d}\mathbf{x} \\
&= -2 \int p(\mathbf{x}) \sum_{i=1}^{N} \frac{\partial \log p(\mathbf{x})}{\partial \mathbf{x}_i} \mathbf{s}_{\theta i}(\mathbf{x}) \mathrm{d}\mathbf{x} \\
&= -2 \sum_{i=1}^{N} \int \frac{\partial p(\mathbf{x})}{\partial \mathbf{x}_i} \mathbf{s}_{\theta i}(\mathbf{x}) \mathrm{d}\mathbf{x} \\
&= -2 \sum_{i=1}^{N} \left( \left[p(\mathbf{x}) \mathbf{s}_{\theta i}(\mathbf{x})\right]_{\partial V} - \int p(\mathbf{x}) \frac{\partial \mathbf{s}_{\theta i}(\mathbf{x})}{\partial \mathbf{x}_i} \mathrm{d}\mathbf{x} \right) \\
&= 2 \sum_{i=1}^{N} \int p(\mathbf{x}) \frac{\partial \mathbf{s}_{\theta i}(\mathbf{x})}{\partial \mathbf{x}_i} \mathrm{d}\mathbf{x} \\
&= 2 \int p(\mathbf{x}) \left( \sum_{i=1}^{N} \frac{\partial \mathbf{s}_{\theta i}(\mathbf{x})}{\partial \mathbf{x}_i} \right) \mathrm{d}\mathbf{x} \\
&= 2 \int p(\mathbf{x}) \text{tr}(\nabla_{\mathbf{x}} \mathbf{s}_{\theta}(\mathbf{x})) \mathrm{d}\mathbf{x}
\end{align*}
$$
最后二、三项的和为：
$$
\begin{align*}\mathcal{L} &= \int p(\mathbf{x}) \left\| \mathbf{s}_{\theta}(\mathbf{x}) \right\|_2^2 \mathrm{d}\mathbf{x} + 2 \int p(\mathbf{x}) \text{tr}(\nabla_{\mathbf{x}} \mathbf{s}_{\theta}(\mathbf{x})) \mathrm{d}\mathbf{x} \\&= \mathbb{E}_{p(\mathbf{x})} \left[ \left\| \mathbf{s}_{\theta}(\mathbf{x}) \right\|_2^2 + 2\,\text{tr}(\nabla_{\mathbf{x}} \mathbf{s}_{\theta}(\mathbf{x})) \right]\end{align*}
$$
对此优化目标转化完毕！
二阶偏导 \(\text{tr}(\nabla_{\mathbf{x}} \mathbf{s}_{\theta}(\mathbf{x}))\) 虽然可以计算， 但是计算成本时非常高的，尤其是在变量 \(x\) 很高维或者神经网络层次很深的时候， 通常是无法计算的。
## **Explict score matching**
**核密度估计 (Kernel Density Estimation, KDE)**
原理：核心思想是在每个数据点上放置一个“核函数”（Kernel），然后将所有这些核函数叠加起来，形成最终的密度估计。
在给定数据集 \(X = \{\mathbf{x}^{(1)},\cdots, \mathbf{x}^{(M)}\}\)
$$
q_h(\mathbf{x}) = \frac{1}{M} \sum_{m=1}^{M} \frac{1}{h} K\left(\frac{\mathbf{x} - \mathbf{x}^{(m)}}{h}\right)
$$
\(h\) 是核函数 \(K(\cdot)\) 的某个超参数， \(\mathbf{x}^{(m)}\) 是训练集中的第 \((m)\)个样本。图3.7说明了核密度估计的思想。在左边的图中，展示了以不同数据点 \(\mathbf{x}^{(m)}\) 为中心的多个核 \(K(\cdot)\)。所有这些单独的核的和给了我们总的核密度估计 \(q(x)\)在右侧，我们显示了一个真实的直方图和相应的核密度估计。我们注意到 \(q(x)\) 最多是真实数据分布\(p(x)\)的近似值，而真实数据分布\(p(x)\)是未知的。
> [Notion 图片已省略：原链接为临时地址]

kernel density estimation 局限：当样本量小，数据是高维的时候，kernel density estimation效果差。
在score matching 时，由于真实数据分布\(p(x)\)是未知的，并且利用kernel density estimation 可以估计出\(p(x)\)，所以得分函数 \(\mathbf{s}_{\theta}(\mathbf{x})\)可以学习近似分布\(q(x)\)，因为优化目标的损失函数可以变为：
$$
\begin{aligned}J_{\text{ESM}}(\boldsymbol{\theta}) &\stackrel{\text{def}}{=} \frac{1}{2} \mathbb{E}_{p(\mathbf{x})} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}) - \nabla_{\mathbf{x}} \log p(\mathbf{x}) \right\|^2 \\&\approx \frac{1}{2} \mathbb{E}_{q_h(\mathbf{x})} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}) - \nabla_{\mathbf{x}} \log q_h(\mathbf{x}) \right\|^2 .\end{aligned}
$$
带入kernel density estimation，最后使用的损失函数如下：
$$
\begin{aligned}J_{\text{ESM}}(\boldsymbol{\theta}) &= \mathbb{E}_{q_h(\mathbf{x})} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}) - \nabla_{\mathbf{x}} \log q_h(\mathbf{x}) \right\|^2 \\&= \int \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}) - \nabla_{\mathbf{x}} \log q_h(\mathbf{x}) \right\|^2 q_h(\mathbf{x}) d\mathbf{x} \\&\approx \frac{1}{M} \sum_{m=1}^{M} \int \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}) - \nabla_{\mathbf{x}} \log q_h(\mathbf{x}) \right\|^2 \frac{1}{h} K\left(\frac{\mathbf{x} - \mathbf{x}^{(m)}}{h}\right) d\mathbf{x}.\end{aligned}
$$
在最后的生成（推理）过程中，基于Langevin dynamics ，推理过程公式为：
$$
\mathbf{x}_{t+1} = \mathbf{x}_t + \tau \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}_t) + \sqrt{2\tau}\mathbf{z}.
$$
## **Denoising score matching**
降噪分数匹配（Denoising score matching），它是分数匹配算法的一个变种， 它可以完全避开 \(\text{tr}(\nabla_{\mathbf{x}} \mathbf{s}_{\theta}(\mathbf{x}))\) 的计算。 
他跟**Explict score matching **的区别在于：用条件分布 \(q(\mathbf{x}|\mathbf{x}')\) 替换掉了\(q(\mathbf{x})\) ，下述是修改后的损失函数表达式：
$$
J_{\text{DSM}}(\boldsymbol{\theta}) \stackrel{\text{def}}{=} \mathbb{E}_{q(\mathbf{x}, \mathbf{x}')} \left[ \frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}) - \nabla_{\mathbf{x}} \log q(\mathbf{x}|\mathbf{x}') \right\|^2 \right]
$$
进一步地，
$$
\begin{aligned}\nabla_{\mathbf{x}} \log q(\mathbf{x}|\mathbf{x}') &= \nabla_{\mathbf{x}} \log \frac{1}{(\sqrt{2\pi\sigma^2})^d} \exp\left\{-\frac{\|\mathbf{x} - \mathbf{x}'\|^2}{2\sigma^2}\right\} \\&= \nabla_{\mathbf{x}} \left\{ -\frac{\|\mathbf{x} - \mathbf{x}'\|^2}{2\sigma^2} - \log(\sqrt{2\pi\sigma^2})^d \right\} \\&= -\frac{\mathbf{x} - \mathbf{x}'}{\sigma^2} = -\frac{\mathbf{z}}{\sigma}.\end{aligned}
$$
其中 \(q(\mathbf{x}|\mathbf{x'})= N(\mathbf{x}|\mathbf{x'},\sigma^2 \mathbf{I})\) 由重参数化可得 \(\mathbf{x} = \mathbf{x}' + \sigma \mathbf{z}.\)
将上述得分函数的梯度带入损失函数，有：
$$
\begin{aligned}J_{\text{DSM}}(\boldsymbol{\theta}) &\stackrel{\text{def}}{=} \mathbb{E}_{q(\mathbf{x},\mathbf{x}')} \left[ \frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}) - \nabla_{\mathbf{x}} \log q(\mathbf{x}|\mathbf{x}') \right\|^2 \right] \\&= \mathbb{E}_{q(\mathbf{x}')} \left[ \frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}' + \sigma\mathbf{z}) + \frac{\mathbf{z}}{\sigma} \right\|^2 \right].\end{aligned}
$$
关于为什么期望下标的密度函数的变化是因为：
定义 \(g(\mathbf{x}')=\frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}' + \sigma\mathbf{z}) + \frac{\mathbf{z}}{\sigma} \right\|^2\)，有
$$
\begin{aligned}\mathbb{E}_{q(\mathbf{x},\mathbf{x}')} [g(\mathbf{x}')] &= \int \int g(\mathbf{x}') q(\mathbf{x}, \mathbf{x}') d\mathbf{x} d\mathbf{x}' \\&= \int g(\mathbf{x}') \left( \int q(\mathbf{x}, \mathbf{x}') d\mathbf{x} \right) d\mathbf{x}' \\&= \int g(\mathbf{x}') q(\mathbf{x}') d\mathbf{x}' \\&= \mathbb{E}_{q(\mathbf{x}')} [g(\mathbf{x}')]\end{aligned}
$$
最终可定义为：
$$
J_{\text{DSM}}(\boldsymbol{\theta}) = \mathbb{E}_{p(\mathbf{x})} \left[ \frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x} + \sigma\mathbf{z}) + \frac{\mathbf{z}}{\sigma} \right\|^2 \right]
$$
其中将前面式子重新代换回去，则有如上损失函数。
> [Notion 图片已省略：原链接为临时地址]

分数匹配模型（score matching model）的**训练**过程通常是通过最小化去噪分数匹配（denoising score matching）损失函数来完成的。如果我们给定一个训练数据集 \(\{x^{(m)}\}^M_{m=1}\)，那么优化的目标是：
$$
\begin{aligned}\boldsymbol{\theta}^* &= \underset{\boldsymbol{\theta}}{\text{argmin}} \ \mathbb{E}_{p(\mathbf{x})} \left[ \frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x} + \sigma\mathbf{z}) + \frac{\mathbf{z}}{\sigma} \right\|^2 \right] \\&\approx \underset{\boldsymbol{\theta}}{\text{argmin}} \ \frac{1}{M} \sum_{m=1}^{M} \frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}^{(m)} + \sigma\mathbf{z}^{(m)}) + \frac{\mathbf{z}^{(m)}}{\sigma} \right\|^2, \quad \text{其中 } \mathbf{z}^{(m)} \sim \mathcal{N}(0, \mathbf{I}).\end{aligned}
$$
## **Denoising score matching **与 **Explict score matching **的联系
发现去噪分数匹配**Denoising score matching **与 显示分数匹配**Explict score matching **仅相差常数项。
$$
J_{DSM}(\theta) = J_{ESM}(\theta) + C.
$$
---
## NCSN (Noise Conditional Score Network)
### DSM的缺陷
原本DSM 损失函数的方差是固定的，方差过大或过小会导致
如果 \(\sigma\) **太小**：
- 加噪后的数据 \(x+\sigma z\)和原始数据 \(x\)  非常接近。
- 模型可以很好地学到数据高密度区域（比如图像中物体的轮廓）的分数。
- 但在数据密度极低的区域（比如两类数据之间的空白地带），几乎没有加噪后的数据点落在这里，模型无法学习到这些区域的分数，导致生成样本时，模型不知道如何从一个区域“跨越”到另一个区域。
如果 \(\sigma\) **太大**：
- 噪声会严重破坏原始数据的结构，\(x+\sigma z\) 看上去就像一团随机噪声。
- 这有助于模型探索数据空间的全局结构，但会丢失掉精细的局部细节。生成的样本可能会有合理的大致轮廓，但细节模糊。
### **NCSN 的核心思想：噪声条件化与多尺度**
NCSN 的好处：不要只用一个 \(\sigma\) ，而是用一系列从大到小的噪声水平 \(\{\sigma_1,\cdots,\sigma_m\}\)来训练一个模型！为了让单个模型能处理不同噪声水平下的数据，NCSN 做了一个关键改动：将噪声水平 \(\sigma_i\)作为模型的输入之一。
$$
J_{\text{NCSN}}(\boldsymbol{\theta}) = \frac{1}{L} \sum_{i=1}^{L} \lambda(\sigma_i) \ell(\boldsymbol{\theta}; \sigma_i),
$$
其中单个的损失函数定义为：
$$
\ell(\boldsymbol{\theta}; \sigma) = \mathbb{E}_{p(\mathbf{x})} \left[ \frac{1}{2} \left\| \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x} + \sigma\mathbf{z}) + \frac{\mathbf{z}}{\sigma} \right\|^2 \right].
$$
其中一般设置 \(\lambda(\sigma_i)= \sigma_i^2\)，它是一个与 \(\sigma_i\)有关的权重参数，它的作用是可以对不同噪声等级\(\sigma_i\)设置不同的重要性权重。 一般而言噪声序列满足\(\frac{\sigma_1}{\sigma_2} = \dots = \frac{\sigma_{L-1}}{\sigma_L} > 1\)。
最后基于Langevin dynamics ，推理过程公式为：
$$
\mathbf{x}_{t+1} = \mathbf{x}_t + \frac{\alpha_i}{2} \mathbf{s}_{\boldsymbol{\theta}}(\mathbf{x}_t, \sigma_i) + \sqrt{\alpha_i}\mathbf{z}_t, \quad \mathbf{z}_t \sim \mathcal{N}(0, \mathbf{I}),
$$
其中  \(\alpha_i = \frac{\sigma_i}{\sigma_L}\)

> 注：Notion 中的图片链接是临时资源，未直接复制；公式在网页中由 MathJax 渲染。

