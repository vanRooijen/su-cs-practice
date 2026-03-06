---
title: "Groups"
shell: tw314-native
sort_order: 31
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-group">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-group"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">5.2</span> <span class="title">Groups</span>
</h2>
<p id="p-297">The algebraic structure of groups provides a useful manner of thinking about modular arithmetic and for finding multiplicative inverses. First we define a binary operation.</p>
<p id="p-298">A <dfn class="terminology">binary operation</dfn> \(\star\) on a set \(\mathcal{S}\) is a function \(f:\mathcal{S}\times \mathcal{S}\rightarrow \mathcal{S}\text{.}\) That is, \(\star\) is a rule which assigns to each ordered pair of elements from \(S\) an element of \(S\text{.}\)</p>
<p id="p-299">For example, addition is a binary operation on the set of integers, since the sum of two integers is again an integer. Note that division is not a binary operation on the set of integers, since it is possible to get a fraction for an answer.</p>
<p id="p-300">A non-empty set \(\mathcal{G}\text{,}\) together with a binary operation \(\star\text{,}\) forms a <dfn class="terminology">group</dfn> \((\mathcal{G},\star)\) if it satisfies</p>
<ol class="decimal">
<li id="li-58">The <dfn class="terminology">assosiative law</dfn>: \((a\star b)\star c=a\star(b\star c)\) for all \(a,b,c\in\mathcal{G}\text{.}\)</li>
<li id="li-59">The existence of an <dfn class="terminology">identity element</dfn>: There exist \(e\in \mathcal{G}\) such that \(a\star e=e\star a=a\) for all \(a\in\mathcal{G}\text{.}\)</li>
<li id="li-60">The existence of <dfn class="terminology">inverses</dfn>: For all \(a\in \mathcal{G}\) there exist a \(b\in \mathcal{G}\) such that \(a\star b=b \star s=e\text{.}\)</li>
</ol>
<p id="p-301">According the definition of a binary operation on \(\mathcal{G}\text{,}\) it follows immediately that if \(a,b\in \mathcal{G}\text{,}\) then \(a\star b\in \mathcal{G}\text{.}\) We say, \(\mathcal{G}\) is <dfn class="terminology">closed</dfn> under \(\star\text{.}\)</p>
<p id="p-302">If \(a\star b=b\star a\) for all \(a,b\in \mathcal{G}\text{,}\) then \((\mathcal{G},\star)\) is a <dfn class="terminology">commutative</dfn>, or <dfn class="terminology">abelian</dfn> group.</p>
<article class="theorem theorem-like" id="theorem-crypto-group"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">5.2.1</span><span class="period">.</span>
</h6>If \((\mathcal{G},\star)\) is a group, then the following holds: <ol class="decimal">
<li id="li-61">the identity element of \((\mathcal{G},\star)\) is unique.</li>
<li id="li-62">each \(a\in \mathcal{G}\) has a unique inverse \(a^{-1}\in\mathcal{G}\text{.}\)</li>
<li id="li-63">\((a^{-1})^{-1}=a\) for any \(a\in \mathcal{G}\text{.}\)</li>
<li id="li-64">\((a\star b)^{-1}=a^{-1}\star b^{-1}\) for any \(a,b\in \mathcal{G}\text{.}\)</li>
</ol></article><article class="example example-like" id="example-crypto-group"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.2.2</span><span class="period">.</span><span class="space"> </span><span class="title">Groups.</span>
</h6>Determine whether the following pairs are groups. <ol class="decimal">
<li id="li-65">\(\displaystyle (\mathbb{Z},+)\)</li>
<li id="li-66">\(\displaystyle (\mathbb{Z},\times)\)</li>
<li id="li-67">\(\displaystyle (\mathbb{Z}_4,+)\)</li>
<li id="li-68">\((\{1,3,5,7\},\cdot)\) where \(\cdot\) denotes multiplication modulo 8.</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-18"><div class="solution solution-like"><ol class="decimal">
<li id="li-69">Note that addition is a binary operations over the integers. Clearly, the addition of integers satisfies the associative law. Furthermore, \(e=0\) since \(a+0=0+a=a\) for any \(a\in\mathbb{Z}\text{.}\) Since \(-a\) is the inverse of \(a\) for every \(a\in \mathbb{Z}\text{,}\) it follows that \((\mathbb{Z},+)\) is a group.</li>
<li id="li-70">Note that multiplication is a binary operations over the integers. Clearly, the multiplication of integers satisfies the associative law. Furthermore, \(e=1\) since \(a\times 1=1\times a=a\) for any \(a\in\mathbb{Z}\text{.}\) Since not every \(a\in \mathbb{Z}\) has an integer inverse, it follows that \((\mathbb{Z},+)\) is not a group.</li>
<li id="li-71">Consider the addition table of \(\mathbb{Z}_4\text{:}\) <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel" style="width:100%;justify-content:flex-start;"><div class="displaymath" id="p-303">
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
</div></div></div></div> The identity is \(e=0\) and the inverses of \(1,2,3\) are \(3,2,1\text{,}\) respectively. Therefore, \((\mathbb{Z}_4,+)\) is a group.</li>
<li id="li-72">Consider the multiplication table of \((\{1,3,5,7\},\cdot)\text{:}\) <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel" style="width:100%;justify-content:flex-start;"><div class="displaymath" id="p-304">
\begin{equation*}
\begin{array}{c|cccc}
\cdot  &amp; 1 &amp; 3 &amp; 5 &amp; 7 \\
\hline
1 &amp; 1 &amp; 3 &amp; 5 &amp; 7 \\
3 &amp; 3 &amp; 1 &amp; 7 &amp; 5 \\
5 &amp; 5 &amp; 7 &amp; 1 &amp; 3 \\
7 &amp; 7 &amp; 5 &amp; 3 &amp; 1 
\end{array}
\end{equation*}
</div></div></div></div> The identity is \(e=1\) and the inverses of \(3,5,7\) are \(3,5,7\text{,}\) respectively. Therefore, \((\{1,3,5,7\},\cdot)\) is a group.</li>
</ol></div></div>
</div></article><p id="p-305">The <dfn class="terminology">multiplicative group of \(\mathbb{Z}_n\)</dfn> is \(\mathbb{Z}^{*}_n = \{a \in \mathbb{Z}_n | \text{GCD}(a, n) = 1\}\text{.}\) In particular, if \(n\) is a prime, then \(\mathbb{Z}^{*}_n = \{1,\dots,n-1\}\text{.}\)</p>
<p id="p-306">A <dfn class="terminology">homomorphism</dfn> betweem two groups, \((G,\star)\) and \((H,\cdot)\text{,}\) is a function \(h: G\mapsto H\) such that \(h(a\star b)=h(a)\cdot h(b)\) holds for all \(a,b\in G\text{.}\) An <dfn class="terminology">isomorphism</dfn> is a bijective homomorphism.</p>
<article class="example example-like" id="example-crypto-iso"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.2.3</span><span class="period">.</span><span class="space"> </span><span class="title">Group isomorphisms.</span>
</h6>Show that the group \((\mathbb{Z}_4,+)\) is isomorphic to the group \((S,\cdot)\) with the following Cayley table: <div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel" style="width:100%;justify-content:flex-start;"><div class="displaymath" id="p-307">
\begin{equation*}
\begin{array}{c|cccc}
\cdot  &amp; a &amp; b &amp; c &amp; d \\
\hline
a &amp; b &amp; d &amp; a &amp; c \\
b &amp; d &amp; c &amp; b &amp; a \\
c &amp; a &amp; b &amp; c &amp; d \\
d &amp; c &amp; a &amp; d &amp; b 
\end{array}
\end{equation*}
</div></div></div></div>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-19"><div class="solution solution-like"><p id="p-308">Let \(h: \mathbb{Z}_4\mapsto S\) with \(h(0)=c, h(1)=a, h(2)=b, h(3)=d\text{.}\) Then \(h\) is an isomorphism from \(\mathbb{Z}_4\) to \(S\) and the two groups are isomorphic.</p></div></div>
</div></article><p id="p-309">A <dfn class="terminology">subgroup</dfn> \((H,\star)\) of \((G,\star)\text{,}\) is a set \(H\subset G\) that is itself a group under \(\star\text{.}\)</p>
<p id="p-310">The <dfn class="terminology">order of the group</dfn> \(G\) is the number of elements in \(G\text{.}\) The <dfn class="terminology">order of an element</dfn> \(a\in G\text{,}\) where \((G,\cdot)\) is a finite group, is the least positive integer \(m\) for which \[\overbrace{a\cdot a\cdot \ldots \cdot a}^{m \text{ times}}=e \] where \(e\) is the identity element of \(G\text{.}\) If \(G\) is a multiplicative group with identity element 1, then \(a^m=1\). If \(G\) is an additive group with identity element 0, then \([m]a=0\).</p>
<article class="theorem theorem-like" id="theorem-crypto-lagrange"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">5.2.4</span><span class="period">.</span>
</h6>If \(G\) is a finite group and \(H\) is a subgroup of \(G\text{,}\) then \(|H|\) divides \(|G|\text{.}\) Hence, if \(a\in G\text{,}\) the order of \(a\) divides the order of \(G\text{.}\)</article><article class="example example-like" id="example-crypto-order"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.2.5</span><span class="period">.</span><span class="space"> </span><span class="title">Order of an element.</span>
</h6>Determine the order of each of the elements in the multiplicative group \(\mathbb{Z}^*_7\) of order 6.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-20"><div class="solution solution-like">
<p id="p-311">Since the group has order 6, an element of \(\mathbb{Z}^*_7\) has order 1, 2, 3 or 6.</p>
<p id="p-312">Since \(1^1=1\text{,}\) the order of 1 is 1.</p>
<p id="p-313">Since \(2^1=2\text{,}\) \(2^2=4\) and \(2^3=1\text{,}\) the order of 2 is 3.</p>
<p id="p-314">Since \(3^1=3\text{,}\) \(3^2=2\text{,}\) \(3^3=6\) and \(3^6=1\text{,}\) the order of 3 is 6.</p>
<p id="p-315">Since \(4^1=4\text{,}\) \(4^2=2\) and \(4^3=1\text{,}\) the order of 4 is 3.</p>
<p id="p-316">Since \(5^1=5\text{,}\) \(5^2=4\text{,}\) \(5^3=6\) and \(5^6=1\text{,}\) the order of 5 is 6.</p>
<p id="p-317">Since \(6^1=6\) and \(6^2=1\text{,}\) the order of 6 is 2.</p>
</div></div>
</div></article><article class="example example-like" id="example-crypto-order_add"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.2.6</span><span class="period">.</span><span class="space"> </span><span class="title">Order of an element.</span>
</h6>Determine the order of 4 in the additive group \((\mathbb{Z}_{12},+)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-21"><div class="solution solution-like">
<p id="p-318">Since the group has order 12, an element of \(\mathbb{Z}_{12}\) has order 1, 2, 3, 4, 6 or 12.</p>
<p id="p-319">Since \(4+4=2\cdot 4=8\) and \(4+4+4=3\cdot 4=12\equiv 0\text{,}\) the order of 4 is 3.</p>
</div></div>
</div></article><p id="p-320">The set \(S\subset G\) is called the <dfn class="terminology">generators</dfn> of \(G\text{,}\) if every element \(y\in G\) is the product of elements of \(S\). We say, the set \(S\) generates \(G\) and denote \(G=\langle S\rangle\text{.}\)</p>
<p id="p-321">If \(S=\{x\}\), \(G\) is generated by a single element and is called <dfn class="terminology">cyclic</dfn>. If \(G=\langle x\rangle\), every element \(y\in G\) can be written as a power of \(x\), that is, \(y=x^i\) for some \(i\geq 0\). Note that a cyclic group may be generated by different elements, that is, it is possible that \(G=\langle x\rangle=\langle y\rangle\) for \(x,y\in G\).</p>
<article class="example example-like" id="example-crypto-generate"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.2.7</span><span class="period">.</span><span class="space"> </span><span class="title">Order of an element.</span>
</h6>Construct all the subgroups of the multiplicative group \(\mathbb{Z}^*_7\text{.}\) Also determine whether \(\mathbb{Z}^*_7\) is cyclic.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-22"><div class="solution solution-like">
<p id="p-322">Since the group has order 6, a subgroup of \(\mathbb{Z}^*_7\) has order 1, 2, 3 or 6.</p>
<p id="p-323">Since the order of 1 is 1, it generates a subgroup of order 1.</p>
<p id="p-324">Since the order of 2 (and 4) is 3, it generates a subgroup of order 3.</p>
<p id="p-325">Since the order of 3 (and 5) is 6, it generates a subgroup of order 6.</p>
<p id="p-326">Since the order of 6 is 2, it generates a subgroup of order 2.</p>
<p id="p-327">For example, since \(2^1=2\text{,}\) \(2^2=4\text{,}\) \(2^3=1\text{,}\) the element 2 generates the subgroup \(\{1,2,4\}\text{.}\)</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="l m b2 r0 l0 t0 lines">Element</td>
<td class="l m b2 r0 l0 t0 lines">Order</td>
<td class="l m b2 r0 l0 t0 lines" data-braille="last-cell">Subgroup</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines">\(1\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{1\}\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(2\)</td>
<td class="l m b0 r0 l0 t0 lines">\(3\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{1,2,4\}\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(3\)</td>
<td class="l m b0 r0 l0 t0 lines">\(6\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{1,2,3,4,5,6\}\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(4\)</td>
<td class="l m b0 r0 l0 t0 lines">\(3\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{1,2,4\}\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(5\)</td>
<td class="l m b0 r0 l0 t0 lines">\(6\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{1,2,3,4,5,6\}\)</td>
</tr>
<tr>
<td class="l m b0 r0 l0 t0 lines">\(6\)</td>
<td class="l m b0 r0 l0 t0 lines">\(2\)</td>
<td class="l m b0 r0 l0 t0 lines" data-braille="last-cell">\(\{1,6\}\)</td>
</tr>
</table></div></div></div>
<p id="p-328">Since \(\mathbb{Z}^*_7=\langle 3\rangle\) (or \(\mathbb{Z}^*_7=\langle 5\rangle\)), it is a cyclic group.</p>
</div></div>
</div></article></section></div>
</div>
