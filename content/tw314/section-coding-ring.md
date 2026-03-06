---
title: "The ring of polynomials modulo \\(f(x)\\)"
shell: tw314-native
sort_order: 71
---

<div class="tw314-native-document" data-tw314-slug="section-coding-ring">
<div id="content" class="pretext-content"><section class="section" id="section-coding-ring"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">11.2</span> <span class="title">The ring of polynomials modulo \(f(x)\)</span>
</h2>
<p id="p-628">Every vector \(a_0a_1\dots a_{n-1}\in V(n,q)\) corresponds to the polynomial \(a_0+a_1x+\dots +a_{n-1}x^{n-1}\text{.}\)</p>
<p id="p-629">If \(f(x)\in \mathbf{F}_q[x]\) has degree \(n\text{,}\) the ring \(\mathbf{F}_q[x]/f(x)\) consists of all polynomials of degree less than \(n\) with coefficients in \(\mathbf{F}_q\text{.}\) We have \(|\mathbf{F}_q[x]/f(x)|=q^n\text{.}\)</p>
<p id="p-630">The following simple observations are often useful when factorizing a polynomial.</p>
<article class="lemma theorem-like" id="lemma-coding-factor"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">11.2.1</span><span class="period">.</span>
</h6>
<ol class="decimal">
<li id="li-210">A polynomial \(f(x)\) has a linear factor \(x-a\) if and only if \(f(a)=0\text{.}\)</li>
<li id="li-211">A polynomial \(f(x)\in \mathbf{F}[x]\) of degree 2 or 3 is irreducible if and only if \(f(a)\neq 0\) for all \(a\in \mathbf{F}\text{.}\)</li>
<li id="li-212">Over any field, \(x^n-1=(x-1)(x^{n-1}+x^{n-2}+\dots+x+1)\text{.}\)</li>
</ol></article><article class="theorem theorem-like" id="theorem-coding-field"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">11.2.2</span><span class="period">.</span>
</h6>The ring \(\mathbf{F}[x]/f(x)\) is a field if and only if \(f(x)\) is irreducible in \(\mathbf{F}[x]\text{.}\)</article><p id="p-631">For cyclic codes we fix \(f(x)=x^n-1\) and we denote \(\mathbf{F}[x]/(x^n-1)\) by \(\mathbf{R}_n\text{.}\)</p>
<p id="p-632">Identify a vector \((a_0,a_1,\dots,a_{n-1})\in V(n,q)\) with the polynomial \(a(x)=a_0+a_1x+\dots+a_{n-1}x^{n-1}\) in \(\mathbf{R}_n\text{.}\) We shall simultaneously view a code as a subset of \(V(n,q)\) and as a subset of \(\mathbf{R}_n\text{.}\)</p>
<p id="p-633">Now consider what happens when we multiply the polynomial \(a(x)\) by \(x\text{.}\) In \(R_n\text{,}\) we have</p>
<div class="displaymath">
\begin{equation*}
x\cdot a(x)=a_0x+a_1x^2+\cdots +a_{n-1}x^n=a_{n-1}+a_0x+a_1x^2+\cdots +a_{n-2}x^{n-1}\
\end{equation*}
</div>
<p data-braille="continuation">which is the vector \(a_{n-1}a_0a_1\dots a_{n-2}\text{.}\) Thus multiplying the polynomial by \(x^m\) corresponds to a cyclic shift through \(m\) positions.</p>
<p id="p-634">The following theorem gives the algebraic characterization of cyclic codes.</p>
<article class="theorem theorem-like" id="theorem-coding-cyclic"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">11.2.3</span><span class="period">.</span>
</h6>A code \(C\) in \(\mathbf{R}_n\) is a cyclic code if and only if \(C\) satisfies the following two conditions: <ol class="decimal">
<li id="li-213">If \(a(x), b(x)\in C\text{,}\) the \(a(x)+b(x)\in C\text{.}\)</li>
<li id="li-214">If \(a(x)\in C\) and \(r(x)\in \mathbf{R}_n\text{,}\) then \(r(x)a(x)\in C\text{.}\)</li>
</ol></article><article class="hiddenproof" id="proof-42"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-42"><article class="hiddenproof"><p id="p-635">Suppose \(C\) is a cyclic code in \(\mathbf{R}_n\text{.}\) Then \(C\) is linear and so (1) holds. Now suppose \(a(x)\in C\) and \(r(x)=r_0+r_1x+\cdots+r_{n-1}x^{n-1}\in \mathbf{R}_n\text{.}\) Since multiplications by \(x^m\) corresponds to a cyclic shift through \(m\) positions, we have \(x^ma(x)\in C\) and therefore \[r(x)a(x)=r_0a(x)+r_1xa(x)+\cdots+r_{n-1}x^{n-1}a(x)\] is also in \(C\) since each summand is in \(C\text{.}\) Thus (2) holds.</p>
<p id="p-636">Now suppose that (1) and (2) hold. Taking \(r(x)\) to be a scalar, the conditions imply that \(C\) is linear. Taking \(r(x)=x\) in (2) shows that \(C\) is cyclic.</p></article></div>
<p id="p-637">We now give an easy way of constructing examples of cyclic codes.</p>
<p id="p-638">Let \(f(x)\) be any polynomial in \(\mathbf{R}_n\) and let \(\langle f(x)\rangle\) denote the subset of \(\mathbf{R}_n\) consisting of all multiples of \(f(x)\text{,}\) that is,</p>
<div class="displaymath">
\begin{equation*}
\langle f(x)\rangle =\{r(x)f(x)|r(x)\in\mathbf{R}_n\}.
\end{equation*}
</div>
<article class="theorem theorem-like" id="theorem-coding-generate"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">11.2.4</span><span class="period">.</span>
</h6>For any \(f(x)\in \mathbf{R}_n\text{,}\) the set \(\langle f(x)\rangle\) is a cyclic code; it is called the cyclic code <dfn class="terminology">generated</dfn> by \(f(x)\text{.}\)</article><article class="hiddenproof" id="proof-43"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-43"><article class="hiddenproof">To prove that \(\langle f(x)\rangle\) is a cyclic code, you should show that the conditions in <span class="xref">Theorem 11.2.3</span> are satisfied. The proof is left as an exercise.</article></div>
<article class="example example-like" id="example-coding-cycli2"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">11.2.5</span><span class="period">.</span><span class="space"> </span><span class="title">Generating cyclic codes.</span>
</h6>Construct the code \(C=\langle 1+x^2\rangle\) in \(\mathbf{R}_3\) over \(\mathbf{F}_2\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-57"><div class="solution solution-like">Multiplying \(1+x^2\) by each of the eight elements of \(R_3\) (and reducing modulo \(x^3-1\)) produces only four distinct codewords, namely \(0,1+x,1+x^2\) and \(x+x^2\text{.}\) Thus \(C\) is the code \(\{000,110,101,011\}\text{.}\)</div></div>
</div></article><p id="p-639">We next show that any cyclic code is generated by a polynomial.</p>
<article class="theorem theorem-like" id="theorem-coding-cyclicgen"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">11.2.6</span><span class="period">.</span>
</h6>Let \(C\) be a non-zero cyclic code in \(\mathbf{R}_n\text{.}\) Then <ol class="decimal">
<li id="li-215">there exist a unique monic polynomial \(g(x)\) of smallest degree in \(C\text{,}\)</li>
<li id="li-216">\(C=\langle g(x)\rangle\text{,}\) and</li>
<li id="li-217">\(g(x)\) is a factor of \(x^n-1\text{.}\)</li>
</ol></article><article class="hiddenproof" id="proof-44"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-44"><article class="hiddenproof"><ol class="decimal">
<li id="li-218">Suppose \(g(x)\) and \(h(x)\) are both monic polynomials in \(C\) of smallest degree. Then \(g(x)-h(x)\in C\) and has smaller degree. This gives a contradiction if \(g(x)\neq h(x)\text{,}\) for then a suitable scalar multiple of \(g(x)-h(x)\) is monic, is in \(C\text{,}\) and is of smaller degree then \(\deg(g(x))\text{.}\)</li>
<li id="li-219">Suppose \(a(x)\in C\text{.}\) By the division algorithm for \(\mathbf{F}[x]\text{,}\) \(a(x)=q(x)g(x)+r(x)\text{,}\) where \(\deg(r(x))&lt;\deg(g(x))\text{.}\) But \(r(x)=a(x)-q(x)g(x)\in C\) and by the minimality of \(\deg(g(x)\text{,}\) we must have \(r(x)=0\) and so \(a(x)\in \langle g(x)\rangle\text{.}\)</li>
<li id="li-220">By the division algorithm, \(x^n-1=q(x)g(x)+r(x)\text{,}\) where \(\deg(r(x))&lt;\deg(g(x))\text{.}\) But then \(r(x)=-q(x)g(x) (mod x^n-1)\text{,}\) and so \(r(x)\in \langle g(x)\rangle\text{.}\) By the minimality of \(\deg(g(x)\text{,}\) we must have \(r(x)=0\text{,}\) which implies that \(g(x)\) is a factor of \(x^n-1\text{.}\)</li>
</ol></article></div>
<p id="p-640">In a non-zero cyclic code the monic polynomial of least degree is called the <dfn class="terminology">generator polynomial</dfn> of \(C\text{.}\)</p>
<p id="p-641">Note that a cyclic code \(C\) may contain polynomials other than the generator polynomial which also generate \(C\text{.}\) For example, the code \(\{000,110,011,101\}\) is generated by \(1+x^2\text{,}\) but its generator polynomial is \(1+x\text{.}\)</p>
<article class="example example-like" id="example-coding-cyclic3"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">11.2.7</span><span class="period">.</span><span class="space"> </span><span class="title">Cyclic codes of length 3.</span>
</h6>Find all the binary cyclic codes of length 3.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-58"><div class="solution solution-like">
<p id="p-642">Since \(x^3-1=(x+1)(x^2+x+1)\text{,}\) there are four cyclic codes of length 3.</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b0 r0 l0 t0 lines">Generator</td>
<td class="c m b0 r0 l0 t0 lines">Code in \(\mathbf{R}_3\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">Corresponding code</td>
</tr>
<tr>
<td class="c m b1 r0 l0 t0 lines">polynomial</td>
<td class="c m b1 r0 l0 t0 lines"></td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">in \(V(3,2)\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1</td>
<td class="c m b0 r0 l0 t0 lines">all of \(\mathbf{R}_3\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">all of \(V(3,2)\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(x+1\)</td>
<td class="c m b0 r0 l0 t0 lines">\(\{0,1+x,x+x^2,1+x^2\}\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{000,110,011,101\}\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(x^2+x+1\)</td>
<td class="c m b0 r0 l0 t0 lines">\(\{0,1+x+x^2\}\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{000,111\}\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(x^3-1=0\)</td>
<td class="c m b0 r0 l0 t0 lines">\(\{0\}\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{000\}\)</td>
</tr>
</table></div></div></div>
</div></div>
</div></article><article class="lemma theorem-like" id="lemma-coding-generator"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">11.2.8</span><span class="period">.</span>
</h6>Let \(g(x)=g_0+g_1x+\dots+g_{r}x^{r}\) be the generator polynomial of a cyclic code. Then \(g_0\) is non-zero.</article><article class="hiddenproof" id="proof-45"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-45"><article class="hiddenproof">Suppose \(g_0=0\text{.}\) Then \(x^{n-1}g(x)=x^{-1}g(x)\) is a codeword of \(C\) of degree \(r-1\text{,}\) contradicting the minimality of \(\deg(g(x))\text{.}\)</article></div>
<article class="theorem theorem-like" id="theorem-coding-genmatrix"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">11.2.9</span><span class="period">.</span>
</h6>Let \(C\) be a cyclic code with generator polynomial<div class="displaymath">
\begin{equation*}
g(x)=g_0+g_1x+\dots+g_{r}x^{r}
\end{equation*}
</div>of degree \(r\text{.}\) Then dim\((C)=n-r\) and a generator matrix for \(C\) is<div class="displaymath">
\begin{equation*}
G=\begin{bmatrix}
g_0&amp;g_1&amp;g_2&amp;\cdots&amp;g_r&amp;0&amp;0&amp;\cdots&amp;0\\
0&amp;g_0&amp;g_1&amp;g_2&amp;\cdots&amp;g_r&amp;0&amp;\cdots&amp;0\\
0&amp;0&amp;g_0&amp;g_1&amp;g_2&amp;\cdots&amp;g_r&amp;\cdots&amp;0\\
\vdots&amp;\vdots&amp;&amp;\ddots&amp;\ddots&amp;\ddots&amp;&amp;\ddots&amp;\vdots\\
0&amp;0&amp;\cdots&amp;0&amp;g_0&amp;g_1&amp;g_2&amp;\cdots&amp;g_r\\
\end{bmatrix}.
\end{equation*}
</div></article><article class="example example-like" id="example-coding-cyclicgen"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">11.2.10</span><span class="period">.</span><span class="space"> </span><span class="title">Generator matrix of a cyclic code.</span>
</h6>Find all the ternary cyclic codes of length 4 and write down the generator matrix for each of them.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-59"><div class="solution solution-like">
<p id="p-643">Since \(x^4-1=(x-1)(x+1)(x^2+1)\) has \(2^3=8\) divisors, each of which generates a cyclic code.</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">Generator polynomial</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">Generator matrix</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\([I_4]\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(x-1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(\begin{bmatrix}
-1&amp;1&amp;0&amp;0\\0&amp;-1&amp;1&amp;0\\0&amp;0&amp;-1&amp;1
\end{bmatrix}.\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(x+1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(\begin{bmatrix}
1&amp;1&amp;0&amp;0\\0&amp;1&amp;1&amp;0\\0&amp;0&amp;1&amp;1
\end{bmatrix}.\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(x^2+1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(\begin{bmatrix}
1&amp;0&amp;1&amp;0\\0&amp;1&amp;0&amp;1
\end{bmatrix}.\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\((x-1)(x+1)=x^2-1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(\begin{bmatrix}
-1&amp;0&amp;1&amp;0\\0&amp;-1&amp;0&amp;1
\end{bmatrix}.\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\((x-1)(x^2+1)=x^3-x^2+x-1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\([-1\ 1\ -1\ 1]\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\((x+1)(x^2+1)=x^3=x^2+x+1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\([1\ 1\ 1\ 1]\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(x^4-1=0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\([0\ 0\ 0\ 0]\)</td>
</tr>
</table></div></div></div>
</div></div>
</div></article></section></div>
</div>
