---
title: "Equivalent codes"
shell: tw314-native
sort_order: 50
---

<div class="tw314-native-document" data-tw314-slug="section-coding-equiv">
<div id="content" class="pretext-content"><section class="section" id="section-coding-equiv"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.7</span> <span class="title">Equivalent codes</span>
</h2>
<p id="p-498">The natural way to present an \((n,M,d)\)-code \(C\) is by an \(M\times n\) matrix \(\mathcal{C}=(c_{ij})\) whose rows are the distinct codewords; i.e. \(C=\{{\bf c}_1,{\bf c}_2,\ldots,{\bf c}_M\}\text{,}\) where \({\bf c}_i = (c_{i1},c_{i2}, \ldots,c_{in})\text{.}\)</p>
<p id="p-499">A permutations of a set \(S\) is a one-to-one maping from \(S\) to itself. A permutation may be denoted in two different ways:</p>
<ol class="decimal">
<li id="li-151">
<dfn class="terminology">Two-line notation</dfn>: In the first row you list the elements of \(S\) and in the second row the image of each element. For example, let \(S=\{1,2,3,4,5\}\text{,}\) and let \(\alpha\) be the permutation of \(S\) such that \(\alpha(1)=5\text{;}\) \(\alpha(2)=4\text{;}\) \(\alpha(3)=2\text{;}\) \(\alpha(4)=3\) and  \(\alpha(5)=1\text{.}\) We may write:<div class="displaymath">
\begin{equation*}
\begin{pmatrix}
1 &amp; 2 &amp; 3 &amp;4&amp;5\\
\alpha(1) &amp; \alpha(2) &amp; \alpha(3)&amp; \alpha(4)&amp; \alpha(5)
\end{pmatrix}
=
\begin{pmatrix}
1 &amp; 2 &amp; 3 &amp;4&amp;5 \\
5 &amp; 4 &amp; 2&amp;3&amp;1
\end{pmatrix}.
\end{equation*}
</div>
</li>
<li id="li-152">
<dfn class="terminology">Cyclic notation</dfn>: This notation presents the permutation as a product of cycles. For the same permutation above, we write<div class="displaymath">
\begin{equation*}
\alpha=(1\ 5)(2\ 4\ 3)
\end{equation*}
</div>
</li>
</ol>
<p id="p-500">Two codes are called <dfn class="terminology">equivalent</dfn> if one can be obtained from the other by a combination of the following two operrations:</p>
<ol class="decimal">
<li id="li-153">A permutation of the positions of the codewords. That is, the <dfn class="terminology">permutation of columns</dfn>.</li>
<li id="li-154">A permutation of the symbols appearing in a fixed position. That is, a <dfn class="terminology">symbol permutation</dfn> of the \(i\)th column</li>
</ol>
<p id="p-501">Note that, since there is no prescribe wat of ordering the codewords in the matrix, row permutations will result in the same code as what you started with.</p>
<p id="p-502">It should be clear that the distances between codewords remain unchanged during these operations. Hence, equivalence codes have the same parameters \((n,M,d)\text{.}\)</p>
<article class="example example-like" id="example-coding-equiv1"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">8.7.1</span><span class="period">.</span><span class="space"> </span><span class="title">Equivalent codes.</span>
</h6>Show that the codes \(C=\{00100,00011,11111,11000\}\) and \(C'=\{00000,01101,11011,10110\}\) are equivalent.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-40"><div class="solution solution-like">The binary codes \(C\) and \(C'\) below are equivalent, for \(D\) is obtained from \(C\) by the symbol permutation \((0 \ 1)\) in column 3 and \(C'\) is obtained from \(D\) by the column permutation \((2\ 4)\text{.}\)<div class="displaymath">
\begin{equation*}
\begin{matrix}
&amp;&amp;C&amp;&amp;\\
0&amp;0&amp;1&amp;0&amp;0\\
0&amp;0&amp;0&amp;1&amp;1\\
1&amp;1&amp;1&amp;1&amp;1\\
1&amp;1&amp;0&amp;0&amp;0
\end{matrix}\xrightarrow{(0\ 1) \text{ in column 3} }
\begin{matrix}
&amp;&amp;D&amp;&amp;\\
0&amp;0&amp;0&amp;0&amp;0\\
0&amp;0&amp;1&amp;1&amp;1\\
1&amp;1&amp;0&amp;1&amp;1\\
1&amp;1&amp;1&amp;0&amp;0
\end{matrix}
\end{equation*}
</div>
<div class="displaymath">
\begin{equation*}
\begin{matrix}
&amp;&amp;D&amp;&amp;\\
0&amp;0&amp;0&amp;0&amp;0\\
0&amp;0&amp;1&amp;1&amp;1\\
1&amp;1&amp;0&amp;1&amp;1\\
1&amp;1&amp;1&amp;0&amp;0
\end{matrix}\xrightarrow[(2\ 4)]{\text{column permutation }}
\begin{matrix}
&amp;&amp;C'&amp;&amp;\\
0&amp;0&amp;0&amp;0&amp;0\\
0&amp;1&amp;1&amp;0&amp;1\\
1&amp;1&amp;0&amp;1&amp;1\\
1&amp;0&amp;1&amp;1&amp;0
\end{matrix}
\end{equation*}
</div>
</div></div>
</div></article><article class="example example-like" id="example-coding-equiv2"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">8.7.2</span><span class="period">.</span><span class="space"> </span><span class="title">Equivalent codes.</span>
</h6>Show that the codes \(C_1=\{012,120,201\}\) and \(C_2=\{000,111,222\}\) are equivalent.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-41"><div class="solution solution-like">The ternary codes \(C\) and \(C'\) below are equivalent, for \(D\) is obtained from \(C\) by the symbol permutation \((0\ 2\ 1)\) in column 2 and \(C'\) is obtained from \(D\) by the symbol permutation \((0\ 1\ 2)\) in column 3. This shows that \(C\) is equivalent to the ternary repetition code of length three.<div class="displaymath">
\begin{equation*}
\begin{matrix}
&amp;C&amp;\\
0&amp;1&amp;2\\
1&amp;2&amp;0\\
2&amp;0&amp;1
\end{matrix}\xrightarrow[\text{ in column 2}]{(0\ 2\ 1) }
\begin{matrix}
&amp;D&amp;\\
0&amp;0&amp;2\\
1&amp;1&amp;0\\
2&amp;2&amp;1
\end{matrix}\xrightarrow[\text{ in column 3}]{(0\ 1\ 2) }
\begin{matrix}
&amp;C'&amp;\\
0&amp;0&amp;0\\
1&amp;1&amp;1\\
2&amp;2&amp;2
\end{matrix}
\end{equation*}
</div>
</div></div>
</div></article><p id="p-503">By making use of equivalent codes, we can show that any code is equivalent to a code containing the zero vector.</p>
<article class="lemma theorem-like" id="lemma-coding-zero"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">8.7.3</span><span class="period">.</span>
</h6>Any \(q\)-ary \((n,M,d)\)-code over an alphabet \(\{0,1,\ldots,q-1\}\) is equivalent to an \((n,M,d)\)-code which contains the zero vector.</article><article class="hiddenproof" id="proof-20"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-20"><article class="hiddenproof"><p id="p-504">Choose any codeword \(x_1x_2\cdots x_n\) and for each \(x_i\neq 0\) apply the permutation \((0,x_i)\) to the symbols in position \(i\text{.}\)</p></article></div></section></div>
</div>
