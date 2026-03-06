---
title: "Chromatic numbers"
shell: tw314-native
sort_order: 21
---

<div class="tw314-native-document" data-tw314-slug="section-chromatic">
<div id="content" class="pretext-content"><section class="section" id="section-chromatic"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">3.1</span> <span class="title">Chromatic numbers</span>
</h2>
<p id="p-202">A <dfn class="terminology">colouring</dfn> \(\beta\) of a graph \(G\) is an assignment of colours \(i=1,2,\dots,k\) to the vertices of \(G\text{,}\) that is \(\beta : V(G)\mapsto \{1,2,\dots,k\}\text{.}\) Let \(V_i\) be the set of vertices coloured with colour \(i\text{,}\) then \(V_1, V_2, \ldots, V_k\) forms a partition of \(V(G)\text{.}\) We call \(V_1, V_2, \ldots, V_k\) the <dfn class="terminology">colour classes</dfn> of the colouring \(alpha\text{.}\) A <dfn class="terminology">k-colouring</dfn> of \(G\) is a colouring in \(k\) colours, i.e. there are \(k\) colour classes.</p>
<p id="p-203">A colouring is called a <dfn class="terminology">proper colouring</dfn> if no two adjacent vertices have the same colour. In a proper colouring \(\left\langle V_i \right \rangle\) is edgeless for each \(i = 1,2, \ldots, k\text{.}\) We call \(V_1, V_2, \ldots, V_k\) the <dfn class="terminology">colour classes</dfn>. A graph \(G\) is <dfn class="terminology">\(k\)-colourable</dfn> if there exist a proper colouring using at most \(k\) colours.</p>
<p id="p-204">The <dfn class="terminology">chromatic number</dfn> \(\chi(G)\) of a graph \(G\) is the smallest number \(k\) for which \(G\) is \(k\)-colourable, and if \(\chi(G) = k\text{,}\) then we say that \(G\) is <dfn class="terminology">\(k\)-chromatic</dfn>. Note that \(G\) is 1-chromatic if and only if \(G \simeq K_1\) and that \(G\) is 2-chromatic if and only if \(G\) is bipartite. In particular, \(C_{2n}\) is 2-chromatic for \(n = 1,2,\ldots\text{.}\) Also \(C_{2n+1}\) is 3-chromatic for \(n = 1,2,\ldots\) and an example of a 4=chromatic graph is given by \(K_4\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-4colour"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_4colouring.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">3.1.1<span class="period">.</span></span><span class="space"> </span>A graph with a chromatic number of 4.</figcaption></figure><article class="example example-like" id="example-graph-4colour"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">3.1.2</span><span class="period">.</span>
</h6>Show that the graph \(G\) in <span class="xref">Figure 3.1.1</span> has chromatic number 4.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-11"><div class="solution solution-like">
<p id="p-205">A 4-colouring of \(G\) is given by \(V_1 = \{ r,s,t,x \}\text{,}\) \(V_2 = \{ u \}\text{,}\) \(V_3 = \{ v \}\text{,}\) \(V_4 = \{ w \} \) and therefore \(\chi(G)\leq 4\text{.}\)</p>
<p id="p-206">Since \(\left\langle \{ u,v,w,x \} \right\rangle\) is a complete subgraph of \(G\text{,}\) we cannot colour the vertices of \(G\) in less than 4 colours; hence \(\chi(G) = 4\text{.}\)</p>
</div></div>
</div></article></section></div>
</div>
