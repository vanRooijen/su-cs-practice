---
title: "Number theory"
shell: tw314-native
sort_order: 40
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-number">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-number"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">7.1</span> <span class="title">Number theory</span>
</h2>
<p id="p-433">Remember that two integers \(a\) and \(b\) are <dfn class="terminology">relatively prime</dfn> if \(\text{GCD}(a,b)=1\text{.}\)</p>
<p id="p-434">We saw that in a group \(G\) it is true that for any element \(x\in G\) we have \(x^{|G|}=1\text{.}\) Fermat's Little theorem considers when \(x^{n-1}=1\pmod{n}\) for \(n\) prime.</p>
<article class="theorem theorem-like" id="theorem-crypto-fermat"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">7.1.1</span><span class="period">.</span><span class="space"> </span><span class="title">Fermat's Little Theorem.</span>
</h6>Suppose \(n\) and \(x\) are relatively prime positive integers, with \(n\) prime, then \(x^{n-1} \equiv 1 \pmod n\text{.}\)</article><p id="p-435">In fact for any finite field \(\mathbf{F}_q\text{,}\) \(x^{q-1} = 1\) holds for all nonzero \(x \in \mathbf{F}_q\text{.}\)</p>
<p id="p-436">The <dfn class="terminology">Euler \(\phi\) function</dfn>, also called the Euler totient function gives the number of numbers that are relatively prime to \(n\text{.}\) That is</p>
<div class="displaymath">
\begin{equation*}
\phi(n)=|\{a\in \mathbf{Z}_n\setminus \{0\}:\text{GCD}(a,n)=1\}|\text{.}
\end{equation*}
</div>
<p data-braille="continuation">That is \(\phi(n)=|\mathbf{Z}^*_n|\text{.}\)</p>
<p id="p-437"><em class="alert">Properties of \(\phi(n)\)</em>:</p>
<ol class="decimal">
<li id="li-115">\(\phi(n)\) is even for all \(p\geq 3\text{.}\)</li>
<li id="li-116">\(\phi(p) = p-1\) for \(p\) prime.</li>
<li id="li-117">\(\phi(p^e) = p^{e-1}(p-1)\) for powers of \(p\) prime.</li>
<li id="li-118">\(\phi\) is multiplicative: \(\phi(m_1 \cdot m_2) = \phi(m_1)\cdot \phi(m_2)\) for all relatively prime numbers \(m_1,m_2\text{.}\)</li>
</ol>
<p id="p-438">The fundamental theorem of arithmetic states that every integer can be factorized into a product of prime powers.</p>
<article class="theorem theorem-like" id="theorem-crypto-factors"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">7.1.2</span><span class="period">.</span><span class="space"> </span><span class="title">Fundamental theorem of arithmetic.</span>
</h6>Every integer \(n \geq 2\) has a factorization as a product of prime powers:<div class="displaymath">
\begin{equation*}
n = p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k} = \prod_{i=1}^k p_i^{e_i}
\end{equation*}
</div>where the \(p_i\)'s are distinct primes, and the \(e_i\)'s are positive integers. Furthermore, the factorization is unique up to rearrangement of factors.</article><p id="p-439">Therefore, if \(n=\prod_{i=1}^k p_i^{e_i}\text{,}\) then \(\phi(n)=\prod_{i=1}^k p_i^{e_i-1}(p_i-1)\text{.}\)</p>
<article class="example example-like" id="example-crypto-euler"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">7.1.3</span><span class="period">.</span><span class="space"> </span><span class="title">Euler \(\phi\) function.</span>
</h6>Determine the totient functionfor each of the following. <ol class="decimal">
<li id="li-119">\(\displaystyle \phi(1001)\)</li>
<li id="li-120">\(\displaystyle \phi(27)\)</li>
<li id="li-121">\(\displaystyle \phi(5400)\)</li>
<li id="li-122">\(\displaystyle \phi(1271)\)</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-36"><div class="solution solution-like"><ol class="decimal">
<li id="li-123"><div class="displaymath">
\begin{align*}
\phi(1001)&amp;=\phi(7\times 11\times 13)=\phi(7)\phi(11)\phi(13)\\
&amp;=(7-1)(11-1)(13-1)=720
\end{align*}
</div></li>
<li id="li-124">\(\displaystyle \phi(27)=\phi(3^3)=3^2(3-1)=18\)</li>
<li id="li-125"><div class="displaymath">
\begin{align*}
\phi(5400)&amp;=\phi(2^3\times 3^3\times 5^2)=\phi(2^3)\phi(3^3)\phi(5^2)\\
&amp;=2^2(2-1)\times 3^2(3-1)\times 5^1(5-1)=1440
\end{align*}
</div></li>
<li id="li-126"><div class="displaymath">
\begin{align*}
\phi(1271)&amp;=\phi(31\times 41)=\phi(31)\phi(41)\\
&amp;=30\times 40=1200
\end{align*}
</div></li>
</ol></div></div>
</div></article> Fermat's little theorem can now be adapted to include any number \(n\text{.}\) <article class="theorem theorem-like" id="theorem-crypto-euler"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">7.1.4</span><span class="period">.</span><span class="space"> </span><span class="title">Euler's theorem.</span>
</h6>For \(a\) and \(n\) non-zero relatively prime integers \(a^{\phi(n)} \equiv 1 \pmod n\text{.}\)</article></section></div>
</div>
