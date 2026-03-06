---
title: "Perfect codes"
shell: tw314-native
sort_order: 53
---

<div class="tw314-native-document" data-tw314-slug="section-coding-perfect">
<div id="content" class="pretext-content"><section class="section" id="section-coding-perfect"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">8.10</span> <span class="title">Perfect codes</span>
</h2>
<p id="p-520">Ideally, we would like a code \(C \subseteq (\mathbf{F}_q)^n\) to be such that, for some \(t&gt;0\text{,}\) the \(t\)-spheres centred at the codewords are disjoint, but their union contains every vector in \((\mathbf{F}_q)^n\text{.}\)</p>
<p id="p-521">A code which achieves the <dfn class="terminology">sphere-packing bound</dfn>, i.e. such that equality in <span class="xref">(8.9.1)</span>  holds, is called a <dfn class="terminology">perfect code</dfn>.</p>
<p id="p-522">Note that such a code can correct up to \(t\) errors, but not \(t+1\) errors, by minimum distance decoding; since \((\mathbf{F}_q)^n\subseteq\bigcup\limits_{{\bf x}\in C}S({\bf x},t)\text{,}\) <em class="emphasis">every</em> received vector \({\bf y}\) is within distance \(t\) of some \({\bf x}\in C\text{,}\) and, as the \(t\)-spheres are disjoint, \({\bf y}\) is within distance \(t\) from a <em class="emphasis">unique</em> \({\bf x}\in C\text{.}\)</p>
<p id="p-523">The so-called <dfn class="terminology">trivial perfect codes</dfn> are either any code with exactly one codeword or any binary code with only two codewords of odd length \(\{000\cdots 0,111\cdots 1\}\text{.}\) We shall consider non-trivial perfect codes later on.</p></section></div>
</div>
