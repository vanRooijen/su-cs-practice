---
title: "Minimum distance"
shell: tw314-native
sort_order: 49
---

<div class="tw314-native-document" data-tw314-slug="section-coding-minimum">
<div id="content" class="pretext-content"><section class="section" id="section-coding-minimum"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.6</span> <span class="title">Minimum distance</span>
</h2>
<p id="p-492">The <dfn class="terminology">minimum distance</dfn> \(d(C)\) of a code \(C\) is the smallest of the Hamming distances between distinct codewords, i.e.</p>
<div class="displaymath">
\begin{equation*}
d(C)=\min\{d({\bf x},{\bf y})| \ {\bf x},{\bf y}\in C,\ {\bf x}\neq{\bf y}\}.
\end{equation*}
</div>
<p id="p-493">An  <dfn class="terminology">\((n,M,d)\)-code</dfn> is a code of length \(n\text{,}\) consisting of \(M\) codewords, where the minimum distance of the code is \(d\text{.}\)</p>
<article class="example example-like" id="example-coding-minimum-dist"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">8.6.1</span><span class="period">.</span><span class="space"> </span><span class="title">Find the minimum distance.</span>
</h6>Calculate the minimum distance for each of the following three binary codes. <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(C_1\)</td>
<td class="c m b1 r1 l0 t0 lines">\(C_2\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(C_3\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(00\)</td>
<td class="c m b0 r1 l0 t0 lines">\(000\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(00000\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(01\)</td>
<td class="c m b0 r1 l0 t0 lines">\(011\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(01101\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(10\)</td>
<td class="c m b0 r1 l0 t0 lines">\(101\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(10110\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(11\)</td>
<td class="c m b0 r1 l0 t0 lines">\(10\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(11011\)</td>
</tr>
</table></div></div></div>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-39"><div class="solution solution-like">
<p id="p-494">Since \(d(00,01)=1, d(00,10)=1, d(00,11)=2, d(01,10)=2, d(01,11)=1\) and \(d(10,11)=1\text{,}\) we have \(d(C_1)=1\text{.}\)</p>
<p id="p-495">By considering the Hamming-distances between all possible pairs, we find that \(d(C_2)=2\) and \(d(C_3)=3\text{.}\)</p>
</div></div>
</div></article><article class="theorem theorem-like" id="theorem-coding-minimum"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">8.6.2</span><span class="period">.</span>
</h6>
<ol class="decimal">
<li id="li-145">A code \(C\) can detect \(s\) errors in any codeword if \(d(C)\geq s+1\text{.}\)</li>
<li id="li-146">A code \(C\) can correct \(t\) errors in any codeword if \(d(C)\geq2t+1\text{.}\)</li>
</ol></article><article class="hiddenproof" id="proof-19"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-19"><article class="hiddenproof"><ol class="decimal">
<li id="li-147">Suppose \(d(C)\geq s+1\) and consider any codeword \(\bf x\) of \(C\text{.}\) If the vector \(\bf y\) is the result of \(s\) errors in \({\bf x}\text{,}\) then \(d({\bf x},{\bf y})=s&lt;s+1\leq d(C)\text{;}\) hence \({\bf y}\) is not a codeword of \(C\text{,}\) and therefore the \(s\) errors can be detected.</li>
<li id="li-148">
<p id="p-496">Suppose \(d(C)\geq 2t+1\) and consider any codeword \(\bf x\) of \(C\text{.}\) If the vector \({\bf y}\) is the result of \(t\) errors in \(\bf x\text{,}\) then \(d({\bf x},{\bf y})=t\text{.}\) Suppose now that \(\bf x'\) is a codeword other than \(\bf x\text{.}\) Then \(d({\bf x'},{\bf y})&gt;d({\bf x},{\bf y})\text{,}\) otherwise \(d({\bf x'},{\bf y})\leq d({\bf x},{\bf y})=t\) and we will have \(d({\bf x},{\bf x'})\leq d({\bf x},{\bf y})+d({\bf x'},{\bf y})\leq 2t\text{,}\) which contradicts \(d(C)\geq 2t+1\text{.}\)</p>
<p id="p-497">It follows that \(\bf x\) is the (unique) codeword nearest to \({\bf y}\text{.}\) So nearest neighbour decoding corrects \(t\) errors in \({\bf x}\text{.}\)</p>
</li>
</ol></article></div>
<article class="corollary theorem-like" id="corollary-coding-minimum"><h6 class="heading">
<span class="type">Corollary</span><span class="space"> </span><span class="codenumber">8.6.3</span><span class="period">.</span>
</h6>If a code \(C\) has a minimum distance \(d\text{,}\) then \(C\) can be used either <ol class="decimal">
<li id="li-149">to detect up to \(d-1\) errors, or</li>
<li id="li-150">to correct up to \(\lfloor\frac{d-1}{2}\rfloor\) errors.</li>
</ol></article></section></div>
</div>
