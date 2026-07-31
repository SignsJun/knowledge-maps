import type { ReactNode } from "react";
import { notFound } from "next/navigation";

const noteMeta = {
  ddpm: {
    title: "DDPM",
    subtitle: "Denoising diffusion probabilistic models",
    date: "24 JUN 2025",
    tone: "mint",
    eyebrow: "01 / PROBABILISTIC VIEW",
    lead: "从加噪到去噪，把一个难以直接建模的生成问题拆成一串可学习、可解释的步骤。",
  },
  "score-matching": {
    title: "Score matching",
    subtitle: "Score-based models & score matching",
    date: "02 JUL 2025",
    tone: "sun",
    eyebrow: "02 / GEOMETRIC VIEW",
    lead: "不直接拟合未知密度，而是学习 log-density 的梯度：一张指向数据高密度区域的方向地图。",
  },
  "flow-matching": {
    title: "Flow matching",
    subtitle: "Flow models & flow matching",
    date: "20 JUL 2025",
    tone: "coral",
    eyebrow: "03 / TRANSPORT VIEW",
    lead: "学习一个随时间变化的速度场，让样本沿着 ODE 轨迹从噪声分布抵达数据分布。",
  },
} as const;

type NoteSlug = keyof typeof noteMeta;

export function generateStaticParams() {
  return Object.keys(noteMeta).map((slug) => ({ slug }));
}

function Equation({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="note-equation">
      {label && <span>{label}</span>}
      <code>{children}</code>
    </div>
  );
}

function Step({ number, title, children, tone }: { number: string; title: string; children: ReactNode; tone?: string }) {
  return (
    <div className={`note-step ${tone ?? ""}`}>
      <span>{number}</span>
      <div><strong>{title}</strong><p>{children}</p></div>
    </div>
  );
}

function DdpmNote() {
  return (
    <>
      <section className="note-block">
        <p className="note-kicker">THE BIG PICTURE</p>
        <h2>先把数据变成噪声，再学会把它变回来。</h2>
        <p>DDPM 包含两个方向：前向过程不断给真实数据添加高斯噪声，反向过程从纯噪声出发，一步步预测并去除噪声。训练时学习局部的去噪动作，采样时把这些动作串起来。</p>
        <div className="note-steps">
          <Step number="01" title="Forward process" tone="mint">固定的加噪链，把 x₀ 推向接近 N(0, I) 的 xₜ。</Step>
          <Step number="02" title="Reverse process" tone="coral">学习一个反向转移，把 xₜ 逐步还原成新的 x₀。</Step>
        </div>
      </section>

      <section className="note-block note-block-split">
        <div><p className="note-kicker">01 / FORWARD PROCESS</p><h2>破坏过程是固定的</h2><p>每一步只依赖上一步，噪声强度由预先设定的 βₜ 控制。因为这个过程简单，我们可以绕过中间步骤，直接构造任意时刻的训练样本。</p></div>
        <Equation label="One-step transition">q(xₜ | xₜ₋₁) = N(√(1 − βₜ) xₜ₋₁, βₜ I)</Equation>
      </section>
      <Equation label="Direct sampling from x₀">xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε,    ε ~ N(0, I)</Equation>
      <div className="note-callout mint"><strong>训练的关键</strong><p>给定一张真实数据 x₀，随机采样 t 和 ε，就能直接得到 xₜ。模型因此不需要为每个训练样本完整走完 T 个加噪步骤。</p></div>

      <section className="note-block note-block-split">
        <div><p className="note-kicker">02 / REVERSE PROCESS</p><h2>创造过程由网络负责</h2><p>真实的后验 q(xₜ₋₁ | xₜ) 依赖未知的数据分布，无法直接计算。于是用神经网络参数化反向分布，并让网络预测当前状态中包含的噪声。</p></div>
        <Equation label="Learned transition">pθ(xₜ₋₁ | xₜ) = N(μθ(xₜ, t), Σθ(xₜ, t))</Equation>
      </section>
      <Equation label="Common simplified objective">Lsimple = E || ε − εθ(xₜ, t) ||²</Equation>
      <p className="note-caption">直觉上，网络并不是一次性“画出”整张图，而是在每个噪声水平判断：这一步应该去掉什么。</p>

      <section className="note-block">
        <p className="note-kicker">03 / ELBO & SAMPLING</p>
        <h2>从似然推导到采样流程</h2>
        <p>DDPM 可以看作潜变量模型。直接最大化 log pθ(x₀) 很困难，因此使用变分下界，把目标分解为终点先验、每一步反向后验的 KL，以及最终重建项。</p>
        <Equation label="ELBO decomposition">LELBO = LT + Σₜ&gt;₁ Lₜ₋₁ + L₀</Equation>
        <div className="note-timeline">
          <Step number="T" title="Start from noise">xT ~ N(0, I)</Step>
          <Step number="↓" title="Predict noise">εθ(xₜ, t)</Step>
          <Step number="0" title="Return a sample">x₀</Step>
        </div>
      </section>

      <section className="note-block note-endnote">
        <p className="note-kicker">MY TAKEAWAY</p>
        <p>DDPM 的核心不是“网络突然生成一张图”，而是把一个难问题拆成很多个局部问题：在当前噪声水平下，下一步应该往哪里去噪。噪声日程、时间条件化和采样步数共同决定了质量与速度。</p>
      </section>
    </>
  );
}

function ScoreMatchingNote() {
  return (
    <>
      <section className="note-block">
        <p className="note-kicker">THE BIG PICTURE</p>
        <h2>不追踪密度本身，追踪密度上升的方向。</h2>
        <p>Score function 是 log p(x) 对 x 的梯度。它不告诉我们某个点的密度绝对值，却告诉我们从这个点出发，往哪个方向走更容易进入数据高密度区域。</p>
        <Equation label="Score function">sθ(x) = ∇ₓ log pθ(x)</Equation>
        <div className="note-callout sun"><strong>为什么能量模型有用？</strong><p>写成 pθ(x) = exp(−fθ(x)) / Zθ 后，对 x 求梯度时归一化常数 Zθ 消失，score 变成 −∇ₓfθ(x)。</p></div>
      </section>

      <section className="note-block note-block-split">
        <div><p className="note-kicker">01 / THE CIRCULAR PROBLEM</p><h2>理想目标，却不能直接算</h2><p>我们当然希望模型的 score 接近真实 score，但真实 p(x) 未知。如果一开始就知道 p(x)，也就不需要学习这个模型了。</p></div>
        <Equation label="Ideal objective">E || sθ(x) − ∇ₓ log p(x) ||²</Equation>
      </section>

      <section className="note-block">
        <p className="note-kicker">02 / EXPLICIT SCORE MATCHING</p>
        <h2>用分部积分绕开真实 score</h2>
        <p>展开平方项并对交叉项做分部积分，在边界项消失的条件下，目标可以写成只依赖模型的形式：</p>
        <Equation label="After integration by parts">LESМ = E [ ||sθ(x)||² + 2 tr(∇ₓsθ(x)) ]</Equation>
        <p>代价是需要计算网络输出对输入的 Jacobian trace。对高维图像来说，这个二阶计算很昂贵。KDE 路线可以近似 p(x)，但小样本高维场景下同样受限。</p>
      </section>

      <section className="note-block note-block-split">
        <div><p className="note-kicker">03 / DENOISING SCORE MATCHING</p><h2>给数据加已知的噪声</h2><p>设 x = x′ + σz，其中 z 是标准高斯噪声。条件分布 q(x | x′) 的 score 可以直接计算，因此不再需要 Jacobian trace。</p></div>
        <Equation label="Gaussian conditional score">∇ₓ log q(x | x′) = −(x − x′)/σ² = −z/σ</Equation>
      </section>
      <Equation label="DSM objective">LDSM = ½ E || sθ(x + σz) + z/σ ||²</Equation>

      <section className="note-block">
        <p className="note-kicker">04 / SAMPLING</p>
        <h2>把方向场变成一条随机轨迹</h2>
        <p>训练出 score 后，可以使用 Langevin dynamics。梯度项把样本推向高密度区域，随机项帮助它探索不同的可能性。</p>
        <Equation label="Langevin dynamics">xₜ₊₁ = xₜ + τ sθ(xₜ) + √(2τ) zₜ</Equation>
        <div className="note-steps">
          <Step number="A" title="Large σ">先学习全局结构，帮助样本跨越低密度区域。</Step>
          <Step number="B" title="Small σ">再恢复局部细节，贴近真实数据流形。</Step>
        </div>
      </section>

      <section className="note-block note-endnote">
        <p className="note-kicker">MY TAKEAWAY</p>
        <p>Score matching 提供的是几何视角：模型学习一张数据分布的“坡度图”。DSM 和 NCSN 通过已知噪声、多噪声尺度，把这张图变成可训练、可采样的对象。</p>
      </section>
    </>
  );
}

function FlowMatchingNote() {
  return (
    <>
      <section className="note-block">
        <p className="note-kicker">THE BIG PICTURE</p>
        <h2>把生成重新描述成运输。</h2>
        <p>Flow matching 不再把生成过程理解为许多次随机去噪，而是学习一张随时间变化的速度地图，让粒子沿着 ODE 从简单分布移动到目标分布。</p>
        <div className="note-steps">
          <Step number="01" title="Velocity field">每个时间与位置的方向和速度。</Step>
          <Step number="02" title="Flow">粒子沿速度场实际走过的轨迹。</Step>
          <Step number="03" title="Probability path">所有粒子在时刻 t 的整体分布。</Step>
        </div>
      </section>

      <section className="note-block note-block-split">
        <div><p className="note-kicker">01 / FLOW & VELOCITY</p><h2>规则与结果</h2><p>速度场是河流本身，Flow 是树叶的漂流轨迹。速度场决定粒子此刻如何移动，ODE 则把这张地图和真实路径连接起来。</p></div>
        <Equation label="ODE">dψₜ(x) / dt = uₜ(ψₜ(x))</Equation>
      </section>
      <Equation label="Continuity equation">d pₜ(x) / dt + div(pₜ uₜ)(x) = 0</Equation>
      <div className="note-callout coral"><strong>概率质量守恒</strong><p>连续性方程表达的是：概率不会凭空消失，只会在向量场推动下移动。这也是速度场能够产生目标概率路径的条件。</p></div>

      <section className="note-block">
        <p className="note-kicker">02 / NF & CNF</p>
        <h2>从可逆变换到连续 ODE</h2>
        <p>Normalizing Flow 把多个可逆变换串起来，用 Jacobian determinant 追踪密度变化。Continuous Normalizing Flow 则把离散层换成连续时间 ODE：</p>
        <Equation label="Continuous transformation">dxₜ / dt = vθ(xₜ, t)</Equation>
      </section>

      <section className="note-block note-block-split">
        <div><p className="note-kicker">03 / FLOW MATCHING</p><h2>直接拟合目标速度</h2><p>如果真实的边际路径 pₜ 和速度场 uₜ 已知，目标很简单：让网络输出的速度接近它。但真实边际量通常不可直接计算。</p></div>
        <Equation label="FM objective">LFM = E || vθ(xₜ, t) − uₜ(xₜ) ||²</Equation>
      </section>

      <section className="note-block">
        <p className="note-kicker">04 / CONDITIONAL FLOW MATCHING</p>
        <h2>把不可计算的监督变成可计算的监督</h2>
        <p>为每个数据样本构造一个容易计算的条件概率路径 pₜ(x | x₁) 和条件速度场 uₜ(x | x₁)，再用它监督模型。训练目标的形式不变，但目标速度变得可获得。</p>
        <Equation label="CFM objective">LCFM = E || vθ(xₜ, t) − uₜ(xₜ | x₁) ||²</Equation>
        <Equation label="Simple linear path">xₜ = (1 − t)x₀ + t x₁,    dxₜ / dt = x₁ − x₀</Equation>
      </section>

      <section className="note-block">
        <p className="note-kicker">05 / SAMPLING</p>
        <h2>从噪声出发，解一次 ODE</h2>
        <p>训练完成后，从 x₀ ~ N(0, I) 开始，把学习到的速度场交给 ODE solver，积分到 t = 1，就得到生成样本。</p>
        <div className="note-timeline">
          <Step number="0" title="Noise">x₀ ~ N(0, I)</Step>
          <Step number="→" title="Integrate">dxₜ / dt = vθ(xₜ, t)</Step>
          <Step number="1" title="Data">x₁ ~ pdata</Step>
        </div>
      </section>

      <section className="note-block note-endnote">
        <p className="note-kicker">MY TAKEAWAY</p>
        <p>Flow matching 的价值在于把生成问题变成运输问题：学习一张时间依赖的速度地图，而不是重复猜测下一步噪声。Conditional flow matching 则让这张地图可以用稳定、可计算的监督训练出来。</p>
      </section>
    </>
  );
}

function renderNote(slug: NoteSlug) {
  if (slug === "ddpm") return <DdpmNote />;
  if (slug === "score-matching") return <ScoreMatchingNote />;
  return <FlowMatchingNote />;
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in noteMeta)) notFound();
  const key = slug as NoteSlug;
  const note = noteMeta[key];

  return (
    <main className="note-page">
      <nav className="site-nav shell" aria-label="主导航">
        <a className="brand" href="../../" aria-label="回到 Generative Model Notes 首页"><span className="brand-mark" aria-hidden="true">✦</span><span>GENERATIVE MODEL NOTES</span></a>
        <div className="nav-links"><a href="../../#notes">Notes</a><a href="../../#map">The map</a><a href="../../#about">About</a></div>
        <a className="nav-cta" href="../../">Back home <span aria-hidden="true">↗</span></a>
      </nav>

      <header className={`note-hero shell ${note.tone}`}>
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> {note.eyebrow}</p>
          <h1>{note.title}</h1>
          <p className="note-subtitle">{note.subtitle}</p>
          <p className="note-lead">{note.lead}</p>
        </div>
        <div className="note-stamp"><span>FIELD NOTE</span><strong>{note.date}</strong><small>from noise<br />to structure</small></div>
      </header>

      <div className="note-body shell">
        <aside className="note-aside"><span>IN THIS NOTE</span><a href="#read">Read through</a><a href="../../#notes">All three notes</a><a href="../../#publish">About this site</a></aside>
        <article className="note-content" id="read">{renderNote(key)}</article>
      </div>

      <footer className="site-footer shell"><span>GENERATIVE MODEL NOTES / {note.date}</span><a href="../../#notes">back to notes ↑</a></footer>
    </main>
  );
}
