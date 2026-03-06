---
title: "Modular arithmetic"
shell: tw314-native
sort_order: 30
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-mod">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-mod"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">5.1</span> <span class="title">Modular arithmetic</span>
</h2>
<p id="p-287">A <dfn class="terminology">binary relation</dfn> over a set \(S\) is some relation \(R\) where, for every \(x, y \in S\text{,}\) the statement \(xRy\) is either true or false. For example, "smaller than" is a binary relation.</p>
<p id="p-288">A binary relation \(R\) on the set \(S\) is called an <dfn class="terminology">equivalence relation</dfn> if it is</p>
<ol class="lower-roman">
<li id="li-51"><p id="p-289"><dfn class="terminology">reflexive</dfn>: for every \(x\in S\text{,}\) \(xRx\text{.}\)</p></li>
<li id="li-52"><p id="p-290"><dfn class="terminology">symmetric</dfn>: for every \(x,y\in S\text{,}\) \(xRy\) implies \(yRx\text{.}\)</p></li>
<li id="li-53"><p id="p-291"><dfn class="terminology">transitive</dfn>: for every \(x,y,z\in S\text{,}\) if \(xRy\) and \(yRz\) then \(xRz\text{.}\)</p></li>
</ol>
<p id="p-292">Take \(n,a,b \in \mathbb{Z}\text{.}\) Denoted \(a \equiv b \pmod n\text{,}\) \(a\) is <dfn class="terminology">congruent</dfn> to \(b\) modulo \(n\) if \((a-b)\) is divisible by \(n\text{.}\)</p>
<p id="p-293">Note that "congruent to" is an equivalence relation since the relation is reflexive, symmetric and transitive.</p>
<p id="p-294">An equivalence relation partitions the base set \(S\) into a collection of distinct sets with empty intersections. These sets in the partition is called the <dfn class="terminology">equivalence classes</dfn> of \(R\text{.}\)</p>
<p id="p-295">Take \(a \in \{ 0, \dots, n-1 \}\text{.}\) All elements in the set \(\{a + kn : k \in \mathbb{Z} \}\text{,}\) called the equivalence class of \(a\) modulo \(n\text{,}\) are sometimes called <dfn class="terminology">residues</dfn> or <dfn class="terminology">remainders</dfn>.</p>
<p id="p-296">Denoted by \(\mathbb{Z}_n\) (or \(\mathbb{Z}\backslash n\mathbb{Z}\)), the <dfn class="terminology">integers modulo \(n\)</dfn> is the set of all (equivalence classes of) integers in \(\{0,\dots,n-1\}\text{.}\)</p>
<article class="example example-like" id="example-crypto-mod"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.1.1</span><span class="period">.</span><span class="space"> </span><span class="title">Integers modulo \(n\).</span>
</h6>In \(\mathbb{Z}_6\text{,}\) calculate the following: <ol class="decimal">
<li id="li-54">\(\displaystyle 8+7=\)</li>
<li id="li-55">\(\displaystyle 8\times 7=\)</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-17"><div class="solution solution-like"><ol class="decimal">
<li id="li-56">\(\displaystyle 8+7=15=2\times 6+3\cong 3\pmod 6\)</li>
<li id="li-57">\(\displaystyle 8\times 7=56=9\times 6+2\cong 2\pmod 6\)</li>
</ol></div></div>
</div></article></section></div>
</div>
