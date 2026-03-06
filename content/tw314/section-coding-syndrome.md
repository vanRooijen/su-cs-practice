---
title: "Syndrome decoding"
shell: tw314-native
sort_order: 61
---

<div class="tw314-native-document" data-tw314-slug="section-coding-syndrome">
<div id="content" class="pretext-content"><section class="section" id="section-coding-syndrome"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">9.7</span> <span class="title">Syndrome decoding</span>
</h2>
<p id="p-583">Consider a \([n,k]\) code \(C\) with parity-check matrix \(H\)  For any \({\bf y}\in V(n,q)\) we define the <dfn class="terminology">syndrome</dfn> of \({\bf y}\) to be the vector</p>
<div class="displaymath">
\begin{equation*}
S({\bf y})={\bf y}H^T.
\end{equation*}
</div>
<p id="p-584">If the rows of \(H\) are \({\bf h}_1,{\bf h_2},\ldots,{\bf h}_{n-k}\text{,}\) then \(S({\bf y})=({\bf y}\cdot{\bf h}_1,{\bf y}\cdot{\bf h}_2,\ldots,{\bf y}\cdot{\bf h}_{n-k})\text{.}\) Also note that \(S({\bf y})={\bf 0}\iff {\bf y}\in C\text{.}\)</p>
<article class="lemma theorem-like" id="lemma-coding-syndrome"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">9.7.1</span><span class="period">.</span>
</h6>The vectors \({\bf u}\) and \({\bf v}\) are in the same coset of \(C\) if and only if they have the same syndrome.</article><article class="hiddenproof" id="proof-39"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-39"><article class="hiddenproof"><div class="displaymath">
\begin{gather*}
{\bf u} \text{ and } {\bf v} \text{ are in the same coset}\\
\iff\ {\bf u}+C={\bf v}+C\\
\iff\ {\bf u}-{\bf v}\in C\\
\iff\ ({\bf u}-{\bf v})H^T={\bf 0}\\
\iff\ {\bf u}H^T={\bf v}H^T\\
\iff\ S({\bf u})=S({\bf v})
\end{gather*}
</div></article></div>
<article class="corollary theorem-like" id="corollary-coding-syndrome"><h6 class="heading">
<span class="type">Corollary</span><span class="space"> </span><span class="codenumber">9.7.2</span><span class="period">.</span>
</h6>There is a one-to-one correspondence between cosets and syndromes.</article><p id="p-585">To decode by making use of syndromes, we set up a <dfn class="terminology">syndrome look-up table</dfn> containing two columns; one with the coset leaders of the code and another with their corresponding syndromes. To decode the received vector \({\bf y}\) follow the following steps:</p>
<ol class="decimal">
<li id="li-184">Determine \(S({\bf y})={\bf y}H^T\text{.}\)</li>
<li id="li-185">Let \({\bf z}=S({\bf y})\) and locate \({\bf z}\) in the look-up table.</li>
<li id="li-186">Decode \({\bf y}\) as \({\bf y}-{\bf z}.\)</li>
</ol>
<article class="example example-like" id="example-coding-synrome"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.7.3</span><span class="period">.</span><span class="space"> </span><span class="title">Syndrome decoding.</span>
</h6>Consider the binary code \(C\) with generator matrix<div class="displaymath">
\begin{equation*}
G=\begin{bmatrix}
1&amp;0&amp;1&amp;1\\
0&amp;1&amp;0&amp;1
\end{bmatrix}.
\end{equation*}
</div>Use syndrome decoding to decode the vector \({\bf y}=1111\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-49"><div class="solution solution-like">
<p id="p-586">Since \(G\) is in standard form, it follows from <span class="xref">Theorem 9.6.6</span> that</p>
<div class="displaymath">
\begin{equation*}
G=\begin{bmatrix}
1&amp;0&amp;1&amp;0\\1&amp;1&amp;0&amp;1
\end{bmatrix}
\end{equation*}
</div>
<p data-braille="continuation">is a parity-check matrix of \(C\text{.}\)</p>
<p id="p-587">We saw in <span class="xref">Example 9.5.1</span> that the coset leaders are \(0000,1000,0100\) and \(0010\text{.}\) Now</p>
<div class="displaymath">
\begin{equation*}
S(0000)=[0000]\begin{bmatrix}
1&amp;1\\0&amp;1\\1&amp;0\\0&amp;1
\end{bmatrix}=[0\ 0], \text{ and}
\end{equation*}
</div>
<div class="displaymath">
\begin{equation*}
S(1000)=[1000]\begin{bmatrix}
1&amp;1\\0&amp;1\\1&amp;0\\0&amp;1
\end{bmatrix}=[1\ 1].
\end{equation*}
</div>
<p data-braille="continuation">Similarly \(S(0100)=(0,1)\) and \(S(0010)=(1,0)\text{.}\)</p>
<p id="p-588">The syndrome look-up table is: <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">coset leader \(S({\bf z})\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">syndrome \({\bf z}\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0000</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">00</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">1000</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">11</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0100</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">01</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">0010</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">10</td>
</tr>
</table></div></div></div></p>
<p id="p-589">To decode \({\bf y}=1111\text{,}\) we caculate the syndrome \(S({\bf y})=01\text{.}\) From the table we decode \({\bf y}\) as \(1111-0100=1011\text{.}\)</p>
</div></div>
</div></article></section></div>
</div>
