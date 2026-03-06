---
title: "Dual codes"
shell: tw314-native
sort_order: 60
---

<div class="tw314-native-document" data-tw314-slug="section-coding-dual">
<div id="content" class="pretext-content"><section class="section" id="section-coding-dual"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">9.6</span> <span class="title">Dual codes</span>
</h2>
<p id="p-562">Consider the vectors \({\bf u}=u_1u_2\cdots u_n,\ {\bf v}=v_1v_2\cdots v_n\) of \(V(n,q)\text{.}\) The <dfn class="terminology">inner product</dfn> \({\bf u}\cdot{\bf v}\) of \({\bf u}\) and \({\bf v}\) is defined \({\bf u}\cdot{\bf v}=u_1v_1+u_2v_2+\cdots+u_nv_n\text{.}\) Note that \({\bf u}\cdot{\bf v}\) is a scalar, i.e. \({\bf u}\cdot{\bf v}\in \mathbf{F}_q\text{.}\) If \({\bf u}\cdot{\bf v}=0\text{,}\) then \({\bf u}\) and \({\bf v}\) are called <dfn class="terminology">orthogonal</dfn>.</p>
<p id="p-563">Let \(C\) be a linear \([n,k]\)-code. The <dfn class="terminology">dual code</dfn> \(C^\perp\) of \(C\) is defined by</p>
<div class="displaymath">
\begin{equation*}
C^\perp=\{{\bf v}\in V(n,q)|{\bf u}\cdot{\bf v}=0 {\rm \ for\ all\ } {\bf u}\in C\}
\end{equation*}
</div>
<p data-braille="continuation">i.e. \(C^\perp\) consists of all vectors \(V(n,q)\) which are orthogonal to every codeword in \(C\text{.}\)</p>
<p id="p-564">We now show that \(C^\perp\) is a linear code of dimension \(n-k\)  First, we need two lemmas:</p>
<article class="lemma theorem-like" id="lemma-coding-dotprop"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">9.6.1</span><span class="period">.</span>
</h6>For any \({\bf u},{\bf v},{\bf w}\in V(n,q)\) and \(\lambda,\mu\in \mathbf{F}_q\)<ol class="decimal">
<li id="li-180">\({\bf u}\cdot{\bf v}={\bf v}\cdot{\bf u}\text{,}\) and</li>
<li id="li-181">\((\lambda{\bf u}+\mu{\bf v})\cdot{\bf w}=\lambda({\bf u}\cdot{\bf w})+\mu({\bf v}\cdot{\bf w})\text{.}\)</li>
</ol></article><article class="hiddenproof" id="proof-34"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-34"><article class="hiddenproof"><ol class="decimal">
<li id="li-182"><div class="displaymath">
\begin{align*}
{\bf u}\cdot{\bf v}&amp;=u_1v_1+u_2v_2+\cdots u_nv_n\\
&amp;=v_1u_1+v_2u_2+\cdots+v_nu_n\\
&amp;={\bf v}\cdot{\bf u}
\end{align*}
</div></li>
<li id="li-183"><div class="displaymath">
\begin{align*}
\lambda{\bf u}+\mu{\bf v})\cdot{\bf w}&amp;=(\lambda u_1+\mu v_1,\ldots,\lambda u_n+\mu v_n)\cdot(w_1,\ldots,w_n)\\
&amp;=(\lambda u_1+\mu v_1)w_1+\cdots+(\lambda u_n+\mu v_n)w_n\\
&amp;=\lambda(u_1w_1+\cdots+u_nw_n)+\mu(v_1w_1+\cdots+v_nw_n) \\
&amp;=\lambda({\bf u}\cdot{\bf w})+\mu({\bf v}\cdot{\bf w})
\end{align*}
</div></li>
</ol></article></div>
<article class="lemma theorem-like" id="lemma-coding-orth"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">9.6.2</span><span class="period">.</span>
</h6>Suppose \(C\) is a linear \([n,k]\)-code with generator matrix \(G\text{.}\) Then \({\bf v}\in C^\perp\) if and only if \({\bf v}G^T={\bf 0}\text{,}\) i.e. \({\bf v}\) is in the dual of \(C\) if and only if \({\bf v}\) is orthogonal to every row of \(G\text{.}\)</article><article class="hiddenproof" id="proof-35"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-35"><article class="hiddenproof"><p id="p-565">Note that the rows of \(G\) are codewords. Now, if \({\bf v}\in C^\perp\text{,}\) then \({\bf v}\cdot{\bf u}=0\) for all \({\bf u}\in C\text{;}\) hence \({\bf v}\cdot{\bf r}=0\) for all rows \({\bf r}\) of \(G\text{.}\)</p>
<p id="p-566">Conversely, let \(G\) have rows \({\bf r}_1,{\bf r}_2,\ldots,{\bf r}_k\) and suppose that \({\bf v}\cdot{\bf r}_i=0\) for \(i=1,2,\ldots,k\text{.}\) We must show that \({\bf v}\cdot{\bf u}=0\) for all \({\bf u}\in C\text{.}\) So let \({\bf u}\in C\text{.}\) Then \({\bf u}=\lambda_1{\bf r}_1+\cdots+\lambda_k{\bf r}_k\) for some \(\lambda_1,\ldots,\lambda_k\in \mathbf{F}_q\text{.}\) Now</p>
<div class="displaymath">
\begin{align*}
{\bf v}\cdot{\bf u}&amp;={\bf v}\cdot(\lambda_1{\bf r}_1+\cdots+\lambda_k{\bf r}_k\\
&amp;=\lambda_1({\bf v}\cdot{\bf r}_1)+\cdots+\lambda_k({\bf v}\cdot{\bf r}_k) \text{ by }\knowl{./knowl/lemma-coding-dotprop.html}{\text{Lemma 9.6.1}}\\
&amp;=\lambda_10+\cdots+\lambda_k0 \\
&amp;=0.
\end{align*}
</div></article></div>
<article class="theorem theorem-like" id="theorem-coding-linear-dual"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.6.3</span><span class="period">.</span>
</h6>If \(C\) is a linear \([n,k]\)-code over \(\mathbf{F}_q\text{,}\) then \(C^\perp\) is a linear \([n,n-k]\)-code over \(\mathbf{F}_q\text{.}\)</article><article class="hiddenproof" id="proof-36"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-36"><article class="hiddenproof"><p id="p-567">Let \(C\) be a linear \([n,k]\) code over \(\mathbf{F}_q\text{.}\) We first show that \(C^\perp\) is a linear code. Suppose \({\bf v}_1,{\bf v}_2\in C^\perp\) and \(\lambda,\mu\in \mathbf{F}_q\text{.}\) Then, for all \({\bf u}\in C\)</p>
<div class="displaymath">
\begin{align*}
\lambda{\bf v}_1+\mu{\bf v}_2)\cdot{\bf u}&amp;= \lambda({\bf v}_1\cdot{\bf u})+\mu({\bf v}_2\cdot{\bf u})\text{ by }\knowl{./knowl/lemma-coding-orth.html}{\text{Lemma 9.6.2}}\\
&amp;=\lambda0+\mu0\\
&amp;=0
\end{align*}
</div>
<p data-braille="continuation">Hence \(\lambda{\bf v_1}+\mu{\bf v}_2\in C^\perp\) for all \({\bf v}_1,{\bf v}_2\in C^\perp\) and \(\lambda.\mu\in \mathbf{F}_q\text{.}\) It follows that \(C^\perp\) is linear.</p>
<p id="p-568">We now show that \(C^\perp\) has dimension \(n-k\text{.}\) If \(C_1\) and \(C_2\) are equivalent codes, then \(C_1^\perp\) and \(C_2^\perp\) are also equivalent. We may therefore assume that \(C\) has a standard form matrix</p>
<div class="displaymath">
\begin{equation*}
G=\begin{bmatrix}
1 &amp; \cdots &amp; 0 &amp; a_{11} &amp; \cdots &amp; a_{1,n-k}\\
\ddots &amp; \vdots &amp; \vdots &amp; &amp; \vdots \\
0 &amp; \cdots &amp; 1 &amp; a_{k1} &amp; \cdots &amp; a_{k,n-k}
\end{bmatrix}.
\end{equation*}
</div>
<p data-braille="continuation">Then the elements of \(C^\perp\) <span class="xref">Lemma 9.6.2</span> are precisely the vectors \({\bf v}=v_1v_2\cdots v_n\) satisfying</p>
<div class="displaymath">
\begin{equation*}
G=\begin{matrix}
v_1 &amp; = &amp; -a_{11}v_{k+1}-\cdots-a_{1,n-k}v_n \\
\vdots &amp; &amp; \vdots\hspace{3cm}\vdots \\
v_k &amp; = &amp; -a_{k1}v_{k+1}-\cdots-a_{k,n-k}v_n
\end{matrix}.
\end{equation*}
</div>
<p data-braille="continuation">There are \(q^{n-k}\) such vectors; hence \(|C^\perp|=q^{n-k}\) and therefore \(\dim(C^\perp)=n-k\text{.}\)</p></article></div>
<article class="theorem theorem-like" id="theorem-coding-ddual"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.6.4</span><span class="period">.</span>
</h6>For any \([n,k]\)-code \(C\)<div class="displaymath">
\begin{equation*}
(C^\perp)^\perp=C.
\end{equation*}
</div></article><article class="hiddenproof" id="proof-37"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-37"><article class="hiddenproof">Suppose \({\bf x}\in C\text{.}\) For any \({\bf v}\in C^\perp\text{,}\) \({\bf v}\cdot{\bf u}=0\) for all \({\bf u}\in C\text{;}\) hence \({\bf v}\cdot{\bf x}=0\text{.}\) Therefore \({\bf x}\in(C^\perp)^\perp\text{.}\) So \(C\subseteq(C^\perp)^\perp\text{.}\) But<div class="displaymath">
\begin{equation*}
\dim\left((C^\perp)^\perp\right)=n-(n-k)=k=\dim(C)\text{.}
\end{equation*}
</div>It follows that \(C=(C^\perp)^\perp\text{.}\)</article></div>
<p id="p-569">A <dfn class="terminology">parity-check matrix</dfn> \(H\) for a \([n,k]\)-code \(C\) is a generator matrix of \(C^\perp\text{.}\)</p>
<p id="p-570">Thus a parity-check matrix \(H\) for a code \(C\) with generator matrix \(G\) is an \((n-k)\times n\) matrix satisfying \(GH^T={\bf 0}\text{.}\) It follows from <span class="xref">Lemma 9.6.2</span> and <span class="xref">Theorem 9.6.4</span> that if \(H\) is a parity-check matrix of \(C\text{,}\)  then \(C=\{{\bf x}\in V(n,q)|{\bf x}H^T={\bf 0}\}\text{.}\)</p>
<p id="p-571">In this way any linear code is completely specified by a parity-check matrix.</p>
<article class="example example-like" id="example-coding-dual"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.6.5</span><span class="period">.</span><span class="space"> </span><span class="title">Relationship between a code and its dual.</span>
</h6>Consider the binary code \(C=\{000,110,011,101\}\text{.}\) Find the dual of \(C\) and show that \(C\) can be determined from the parity check matrix.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-48"><div class="solution solution-like">
<p id="p-572">\(C\) is a binary \([3,2]\)-code with generator matrix</p>
<div class="displaymath">
\begin{equation*}
G=\begin{bmatrix}
1&amp;1&amp;0\\
0&amp;1&amp;1
\end{bmatrix}.
\end{equation*}
</div>
<p id="p-573">By <span class="xref">Lemma 9.6.2</span> \(v_1v_2v_3\in C^\perp\iff[v_1v_2v_3]G^T={\bf 0}\text{,}\) i.e.</p>
<div class="displaymath">
\begin{equation*}
[{\bf v_1}\ {\bf v_2} \ {\bf v_3}] \begin{bmatrix}
1&amp;0\\
1&amp;1\\
0&amp;1
\end{bmatrix}=[0\ 0],
\end{equation*}
</div>
<p data-braille="continuation">that is, \(v_1+v_2=0\) and \(v_2+v_3=0\text{.}\)</p>
<p id="p-574">It is now clear that \(C^\perp=\{000,111\}\) and \(C^\perp\) is a binary \([3,1]\)-code with generator matrix \(H=[1\ 1\ 1]\text{.}\)</p>
<p id="p-575">Then \(H=[1\ 1\ 1]\) is a parity-check matrix of \(C\text{.}\) Note that \(GH^T={\bf 0}\text{.}\) Let's now see how \(C\) is specified by \(H\text{.}\)  Well, \(C\) consists of all those vectors \(x_1x_2x_3\) such that</p>
<div class="displaymath">
\begin{equation*}
[{\bf x_1}\ {\bf x_2} \ {\bf x_3}] \begin{bmatrix}
1\\
1\\
1
\end{bmatrix}=0,
\end{equation*}
</div>
<p data-braille="continuation">i.e. such that \(x_1+x_2+x_3=0\text{.}\) So, \(C\) consists of all the even-weight vectors of \(V(3,2)\text{,}\) that is \(C=\{000,110,011,101\}\text{.}\)</p>
</div></div>
</div></article><p id="p-576">The rows of a parity-check matrix \(H\) are <dfn class="terminology">parity checks</dfn> on the codewords. The equations \((x_1x_2\cdots x_n)H^T={\bf 0}\) are called the <dfn class="terminology">parity-check equations</dfn>.</p>
<p id="p-577">In the example above, there is just one parity check \(111\) and one parity check equation \(x_1+x_2+x_3=0\text{.}\)</p>
<p id="p-578">The next theorem gives an easy way of constructing a parity-check matrix for a linear code with given generator matrix if vice versa.</p>
<article class="theorem theorem-like" id="theorem-coding-paritycheck"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.6.6</span><span class="period">.</span>
</h6>If \(G=[I_k|A]\) is the standard form generator matrix of an \([n,k]\)-code \(C\text{,}\) then a parity-check matrix for \(C\) is \(H=[-A^T|I_{n-k}]\text{.}\)</article><article class="hiddenproof" id="proof-38"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-38"><article class="hiddenproof"><p id="p-579">Suppose</p>
<div class="displaymath">
\begin{equation*}
G=\begin{bmatrix}
1 &amp; \cdots &amp; 0 &amp; a_{11} &amp; \cdots &amp; a_{1,n-k} \\
\vdots &amp; \ddots &amp; \vdots &amp; \vdots &amp; &amp; \vdots \\
0 &amp; \cdots &amp; 1 &amp; a_{k1} &amp; \cdots &amp; a_{k,n-k}
\end{bmatrix}
\end{equation*}
</div>
<p data-braille="continuation">and let</p>
<div class="displaymath">
\begin{equation*}
H=\begin{bmatrix}
-a_{11} &amp; \cdots &amp; -a_{k1} &amp; 1 &amp; \cdots &amp; 0 \\
\vdots &amp; &amp; \vdots &amp; \vdots &amp; \ddots &amp; \vdots \\
-a_{1,n-k} &amp; \cdots &amp; -a_{k,n-k} &amp; 0 &amp; \cdots &amp; 1
\end{bmatrix}.
\end{equation*}
</div>
<p id="p-580">Then \(H\) has the size required of a parity-check matrix and its rows are linearly independent. Furthermore, since the inner product of the \(i\)th row of \(G\) with the \(j\)th row of \(H\) is</p>
<div class="displaymath">
\begin{equation*}
0+\cdots+0+(-a_{ij})+0+\cdots+0+a_{ij}+0+\cdots+0=0,
\end{equation*}
</div>
<p data-braille="continuation">it folows that \(GH^T=0\text{.}\)</p></article></div>
<p id="p-581">A parity-check matrix \(H\) is in <dfn class="terminology">standard form</dfn> if \(H=[B|I_{n-k}]\text{.}\)</p>
<p id="p-582">If \(C\) is specified by a parity-check matrix in standard form \(H=[B|I_{n-k}]\text{,}\) then a generator matrix for \(C\) is \(G=[I_k|-B^T]\text{.}\)</p></section></div>
</div>
