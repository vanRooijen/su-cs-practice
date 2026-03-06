---
title: "Cosets"
shell: tw314-native
sort_order: 58
---

<div class="tw314-native-document" data-tw314-slug="section-coding-cosets">
<div id="content" class="pretext-content"><section class="section" id="section-coding-cosets"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">9.4</span> <span class="title">Cosets</span>
</h2>
<p id="p-556">Suppose \(C\) is a \([n,k]\)-code over \(\mathbf{F}_q\text{.}\) For any vector \({\bf a}\) of \(V(n,q)\)</p>
<div class="displaymath">
\begin{equation*}
{\bf a}+C=\{{\bf a}+{\bf x}|{\bf x}\in C\}
\end{equation*}
</div>
<p data-braille="continuation">is called a <dfn class="terminology">coset</dfn> of \(C\text{.}\) A <dfn class="terminology">coset leader</dfn> is a vector of minimum weight in the coset.</p>
<article class="lemma theorem-like" id="lemma-coding-coseteq"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">9.4.1</span><span class="period">.</span>
</h6>If \({\bf a}+C\) is a coset of \(C\) and \({\bf b}\in{\bf a}+C\text{,}\) then \({\bf b}+C={\bf a}+C\) .</article><article class="hiddenproof" id="proof-32"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-32"><article class="hiddenproof"><p id="p-557">Since \({\bf b}\in{\bf a}+C\text{,}\) \({\bf b}={\bf a}+{\bf x}\) for some \({\bf x}\in C\text{.}\) Take any \({\bf z}\in{\bf b}+C\text{.}\) Then \({\bf z}={\bf b}+{\bf y}\) for some \({\bf y}\in C\text{.}\) Now</p>
<div class="displaymath">
\begin{equation*}
{\bf z}={\bf b}+{\bf y}=({\bf a}+{\bf x})+{\bf y}={\bf a}+({\bf x}+{\bf y}) {\rm \ and\ } {\bf x}+{\bf y}\in C;
\end{equation*}
</div>
<p data-braille="continuation">hence \({\bf z}\in{\bf a}+C\text{.}\) So \({\bf b}+C\subseteq{\bf a}+C\text{.}\)</p>
<p id="p-558">Take any \({\bf z}\in{\bf a}+C\text{.}\) Then \({\bf z}={\bf a}+{\bf y}\) for some \({\bf y}\in C\text{.}\) Now</p>
<div class="displaymath">
\begin{equation*}
{\bf z}={\bf a}+{\bf y}=({\bf b}-{\bf x})+{\bf y}={\bf b}+(-{\bf x}+{\bf y}) {\rm \ and\ } -{\bf x}+{\bf y}\in C;
\end{equation*}
</div>
<p data-braille="continuation">hence \({\bf z}\in{\bf b}+C\text{.}\) So \({\bf a}+C\subseteq{\bf b}+C\text{.}\) It follows that \({\bf b}+C={\bf a}+C\text{.}\)</p></article></div>
<article class="theorem theorem-like" id="theorem-coding-lagrange"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">9.4.2</span><span class="period">.</span><span class="space"> </span><span class="title">Lagrange's Theorem.</span>
</h6>Suppose \(C\) is an \([n,k]\) code over \(\mathbf{F}_q\text{.}\) Then <ol class="decimal">
<li id="li-174">every vector of \(V(n,q)\) is in some coset of \(C\text{,}\)</li>
<li id="li-175">every coset contains \(q^k\) vectors, and</li>
<li id="li-176">any two distinct cosets are disjoint.</li>
</ol></article><article class="hiddenproof" id="proof-33"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-33"><article class="hiddenproof"><ol class="decimal">
<li id="li-177">For every \({\bf a}\in V(n,q)\text{,}\) \({\bf a}={\bf a}+{\bf 0}\) and \({\bf 0}\in C\text{;}\) hence \({\bf a}\in {\bf a}+C\text{.}\)</li>
<li id="li-178">For any coset \({\bf a}+C\) of \(C\text{,}\) consider the map \({\bf x}\rightarrow{\bf a}+{\bf x}\) from \(C\) to \({\bf a}+C\text{.}\) It is one-to-one, since \({\bf x}={\bf y}\) if and only if \({\bf a}+{\bf x}={\bf a}+{\bf y}\text{.}\) Therefore \(|{\bf a}+C|=|C|=q^k\) for all cosets \({\bf a}+C\) of \(C\text{.}\)</li>
<li id="li-179">Suppose \({\bf a}+C\) and \({\bf b}+C\) are cosets of \(C\) that are not disjoint. Let \({\bf v}\in{\bf a}+C\) and \({\bf v}\in{\bf b}+C\text{.}\) Then \({\bf v}={\bf a}+{\bf x}\) and \({\bf v}={\bf b}+{\bf y}\) for \({\bf x},{\bf y}\in C\text{.}\) So \({\bf a}+{\bf x}={\bf b}+{\bf y}\text{,}\) hence \({\bf a}={\bf b}+({\bf y}-{\bf x})\) and \({\bf y}-{\bf x}\in C\text{.}\) Therefore \({\bf a}\in{\bf b}+C\) and it follows from <span class="xref">Lemma 9.4.1</span> that \({\bf a}+C={\bf b}+C\text{.}\)</li>
</ol></article></div>
<article class="example example-like" id="example-coding-cosets"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.4.3</span><span class="period">.</span><span class="space"> </span><span class="title">Find cosets.</span>
</h6>Let \(C\) be the binary \([4,2]\)-code with generator matrix<div class="displaymath">
\begin{equation*}
\begin{bmatrix}
1&amp;0&amp;1&amp;1\\
0&amp;1&amp;0&amp;1
\end{bmatrix}.
\end{equation*}
</div>Determine the code \(C\) an the cosets of \(C\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-46"><div class="solution solution-like">Then \(C=\{0000,1011,0101,1110\}\) and the cosets of \(C\) are<div class="displaymath">
\begin{align*}
0000+C &amp; = C \text{ itself}\\
1000+C &amp; = \{1000,0011,1101,0110\}\\
0100+C&amp; =  \{0100,1111,0001,1010\}\\
0010+C&amp; =  \{0010,1001,0111,1100\}
\end{align*}
</div>
</div></div>
</div></article></section></div>
</div>
