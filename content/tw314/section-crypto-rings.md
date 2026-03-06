---
title: "Rings"
shell: tw314-native
sort_order: 32
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-rings">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-rings"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">5.3</span> <span class="title">Rings</span>
</h2>
<p id="p-329">A <dfn class="terminology">ring</dfn> \((\mathcal{R},+,\times)\) satisfies</p>
<ol class="decimal">
<li id="li-73">\((\mathcal{R},+)\) is an abelian group with identity element 0.</li>
<li id="li-74">The operation \(\times\) is associative. That is, \((a \times b) \times c = a \times (b \times c)\) for all \(a,b,c \in \mathcal{R}\text{.}\)</li>
<li id="li-75">There is a multiplicative identity 1, with \(1\neq 0\text{,}\) such that \(a \times 1 = 1 \times a = a\) for all \(a \in \mathcal{R}\text{.}\)</li>
<li id="li-76">The operation \(\times\) is distributive over \(+\text{.}\) That is, \(a \times (b+c) = a \times b +a \times c\) and \((b+c)\times a = b \times a +c \times a\) for all \(a,b,c \in \mathcal{R}\text{.}\)</li>
</ol>
<p id="p-330">The ring is a <dfn class="terminology">commutative ring</dfn> if \(a\times b=b\times a\) for all \(a,b \in \mathcal{R}\text{.}\)</p>
<article class="example example-like" id="example-crypto-ring"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.3.1</span><span class="period">.</span><span class="space"> </span><span class="title">Rings.</span>
</h6>Construct the addition and multiplication tables of \(\mathbb{Z}_4\) to illustrate that \((\mathbb{Z}_4,+,\times)\) is a commutative ring.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-23"><div class="solution solution-like">From the addition and multiplication tables of \(\mathbb{Z}_4\text{,}\) we can check that all 4 axioms hold. <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel" style="width:100%;justify-content:flex-start;"><div class="displaymath" id="p-331">
\begin{equation*}
\begin{array}{c|cccc}
+  &amp; 0 &amp; 1 &amp; 2 &amp; 3 \\
\hline
0 &amp; 0 &amp; 1 &amp; 2 &amp; 3 \\
1 &amp; 1 &amp; 2 &amp; 3 &amp; 0 \\
2 &amp; 2 &amp; 3 &amp; 0 &amp; 1 \\
3 &amp; 3 &amp; 0 &amp; 1 &amp; 2 
\end{array}
\end{equation*}
</div></div></div></div>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel" style="width:100%;justify-content:flex-start;"><div class="displaymath" id="p-332">
\begin{equation*}
\begin{array}{c|cccc}
\times  &amp; 0 &amp; 1 &amp; 2 &amp; 3 \\
\hline
0 &amp; 0 &amp; 0 &amp; 0 &amp; 0 \\
1 &amp; 0 &amp; 1 &amp; 2 &amp; 3 \\
2 &amp; 0 &amp; 2 &amp; 0 &amp; 2 \\
3 &amp; 0 &amp; 3 &amp; 2 &amp; 1 
\end{array}
\end{equation*}
</div></div></div></div>
</div></div>
</div></article><p id="p-333">A polynomial in \(x\) with coefficients in a ring \(\mathcal{R}\) is an expression</p>
<div class="displaymath">
\begin{equation*}
f(x)=f_nx^n+f_{n-1}x^{n-1}+\dots+f_2x^2+f_1x+f_0
\end{equation*}
</div>
<p data-braille="continuation">where \(f_i\in \mathcal{R}\) and \(f_n\neq 0\) if \(n >0\).</p>
<p id="p-334">The <dfn class="terminology">degree of \(f\)</dfn> is \(n\) and is denoted by \(\deg(f)=n\text{.}\)</p>
<p id="p-335">The <dfn class="terminology">ring of polynomials</dfn> over \(\mathcal{R}\) is the commutative ring formed by the set of all such polynomials, denoted \(\mathcal{R}[x]\text{.}\)</p>
<article class="example example-like" id="example-crypto-poly"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.3.2</span><span class="period">.</span><span class="space"> </span><span class="title">Multiplication and addition in polynomial rings.</span>
</h6>Let \(f(x) = x^3 + x + 1\) and \(g(x) = x^2 + x\) be elements of the polynomial ring \(\mathbb{Z}_2[x]\text{.}\) Working in \(\mathbb{Z}_2[x]\text{,}\) calculate: <ol class="decimal">
<li id="li-77">\(\displaystyle f(x) + g(x) =\)</li>
<li id="li-78">\(\displaystyle f(x) \times g(x) =\)</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-24"><div class="solution solution-like"><ol class="decimal">
<li id="li-79"><div class="displaymath">
\begin{align*}
f(x) + g(x)&amp; =x^3 + x + 1+x^2 + x\\
&amp;=x^3+x^2+2x+1\\
&amp; \equiv x^3+x^2+1 \text{ over } \mathbb{Z}_2.
\end{align*}
</div></li>
<li id="li-80"><div class="displaymath">
\begin{align*}
f(x) \times g(x)&amp; =(x^3 + x + 1)(x^2 + x)\\
&amp;=x^5+x^4+x^3+x^2+x^2+x\\
&amp;=x^5+x^4+x^3+2x^2+x\\
&amp; \equiv x^5+x^4+x^3+x \text{ over } \mathbb{Z}_2.
\end{align*}
</div></li>
</ol></div></div>
</div></article><p id="p-336">If \(g(x), h(x) \in \mathcal{R}[x]\text{,}\) then \(g(x)\) is said to be <dfn class="terminology">congruent to \(h(x)\) modulo \(f(x)\)</dfn> if \(f(x)\) divides \(g(x)-h(x)\text{.}\) This is denoted by \(g(x) \equiv  h(x) \pmod f(x)\text{.}\)</p>
<p id="p-337">Take \(f(x)\in \mathcal{R}[x]\) with \(\deg(f)=n\text{.}\) The set</p>
<div class="displaymath">
\begin{equation*}
\{a\in \mathcal{R}[x]:\deg(a)&lt;n\}=\mathcal{R}[x]/f(x)
\end{equation*}
</div>
<p data-braille="continuation">consist of all polynomials in \(\mathcal{R}[x]\) with degrees less than \(f\text{.}\) Addition and multiplication is done modulo \(f(x)\text{.}\)</p>
<p id="p-338">\((\mathcal{R}[x]/f(x),+,\times)\) is a commutative ring.</p>
<article class="example example-like" id="example-crypto-poly_table"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.3.3</span><span class="period">.</span><span class="space"> </span><span class="title">Cayley tables in polynomial rings.</span>
</h6>Construct the multiplication and addition tables of \(\mathbb{Z}_2[x]/(x^2+x+1)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-25"><div class="solution solution-like">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel" style="width:100%;justify-content:flex-start;"><div class="displaymath" id="p-339">
\begin{equation*}
\begin{array}{c|cccc}
+  &amp; 0 &amp; 1 &amp; x &amp; x+1 \\
\hline
0 &amp; 0 &amp; 1 &amp; x &amp; x+1 \\
1 &amp; 1 &amp; 0 &amp; x+1 &amp; x \\
x &amp; x &amp; x+1 &amp; 0 &amp; 1 \\
x+1 &amp; x+1 &amp; x &amp; 1 &amp; 0 
\end{array}
\end{equation*}
</div></div></div></div>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel" style="width:100%;justify-content:flex-start;"><div class="displaymath" id="p-340">
\begin{equation*}
\begin{array}{c|cccc}
\times  &amp; 0 &amp; 1 &amp; x &amp; x+1 \\
\hline
0 &amp; 0 &amp; 0 &amp; 0 &amp; 0 \\
1 &amp; 0 &amp; 1 &amp; x &amp; x+1 \\
x &amp; 0 &amp; x &amp; x+1 &amp; 1 \\
x+1 &amp; 0 &amp; x+1 &amp; 1 &amp; x 
\end{array}
\end{equation*}
</div></div></div></div>
<p id="p-341">Where</p>
<div class="displaymath">
\begin{align*}
x \times x&amp; =x^2 -(x^2+x+1)\\
&amp;\equiv x+1 \pmod{(x^2+x+1)}\text{,}
\end{align*}
</div>
<div class="displaymath">
\begin{align*}
x \times (x+1)&amp; =x^2 +x -(x^2+x+1)\\
&amp;\equiv 1 \pmod{(x^2+x+1)}
\end{align*}
</div>
<p data-braille="continuation">and</p>
<div class="displaymath">
\begin{align*}
(x+1) \times (x+1)&amp; =x^2+2x+1 -(x^2+x+1)\\
&amp;\equiv x \pmod{(x^2+x+1)}.
\end{align*}
</div>
</div></div>
</div></article><p id="p-342">An element \(a\in \mathcal{R}\) is called a <dfn class="terminology">unit</dfn> if there exist an element \(b\in \mathcal{R}\) such that \(a\times b=1\text{.}\)</p>
<p id="p-343">The set of units in a ring \(\mathcal{R}\) forms a group under multiplication and is called the <dfn class="terminology">group of units</dfn>. The group of units of the ring \(\mathbf{Z}_n\) is denoted by \(\mathbf{Z}_n^*\text{.}\)</p></section></div>
</div>
