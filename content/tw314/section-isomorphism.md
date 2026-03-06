---
title: "Equality and isomorphism"
shell: tw314-native
sort_order: 9
---

<div class="tw314-native-document" data-tw314-slug="section-isomorphism">
<div id="content" class="pretext-content"><section class="section" id="section-isomorphism"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">1.5</span> <span class="title">Equality and isomorphism</span>
</h2>
<p id="p-26">Two graphs \(G\) and \(H\) are <dfn class="terminology">equal</dfn>, in which case we write \(G = H\text{,}\) if \(V(G) = V(H)\) and \(E(G) = E(H)\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-equality"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_equality.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.5.1<span class="period">.</span></span><span class="space"> </span>Equality</figcaption></figure><article class="example example-like" id="example-graph-equality"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.5.2</span><span class="period">.</span><span class="space"> </span><span class="title">Graph equality.</span>
</h6>
<p id="p-27">Consider the graphs \(G\text{,}\) \(H\) and \(K\) defined by their graphic representations in <span class="xref">Figure 1.5.1</span>.</p>
<p id="p-28">Since both \(G\) and \(H\) have vertex set \(V = \{1, 2, 3, 4 \}\) and edge set \(E=\{(1,2), (2,4), (4,3), (3,1), (2,3) \}\text{,}\) \(G = H\text{,}\) . However, \(G \not= K\text{,}\) since their edge sets are not equal: \(G\) has \((1,3)\) as an edge, but \((1,3)\) is not an edge of \(K\text{.}\)</p></article> A graph \(G\) is <dfn class="terminology">isomorphic</dfn> to a graph \(H\text{,}\) write \(G \simeq H\text{,}\) if there exists a bijection \(\phi: V(G) \rightarrow V(H)\) such that \(uv \in E(G)\) if and only if \(\phi(u)\phi(v)\in E(H)\text{.}\) <article class="example example-like" id="example-graph-isomorphic"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.5.3</span><span class="period">.</span><span class="space"> </span><span class="title">Isomorphic graphs.</span>
</h6> The graphs \(G\) and \(K\) in <span class="xref">Figure 1.5.1</span> are isomorphic. An isomorphism \(\phi: V(G) \rightarrow V(K)\) is given by \(\phi(1) = 1,\ \phi(2) = 2,\ \phi(3) = 4,\ \phi(4) = 3\text{.}\)</article><p id="p-29">Note that if two graphs \(G\) and \(H\) are equal, then they must be isomorphic, for an isomorphism is given by the identity function \(\phi: V \rightarrow V\) with \(\phi(v) = v\) for all \(v \in V\text{.}\)</p>
<p id="p-30">Also note that the relationship of "being isomorphic to" is an equivalence relation on graphs. Therefore, an isomorphism divides graphs into equivalence classes, two graphs being <dfn class="terminology">non-isomorphic</dfn> if they belong to different equivalence classes.</p>
<figure class="figure figure-like" id="figure-graph-isomorphism"><div class="image-box" style="width: 70%; margin-left: 15%; margin-right: 15%;"><img src="/tw314-assets/images/figure_isomorphism.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">1.5.4<span class="period">.</span></span><span class="space"> </span>Isomorphism</figcaption></figure><article class="example example-like" id="example-graph-iso2"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">1.5.5</span><span class="period">.</span><span class="space"> </span><span class="title">More graph isomorphisms.</span>
</h6>
<p id="p-31">Consider the graphs \(G_1\text{,}\) \(G_2\) and \(G_3\) in <span class="xref">Figure 1.5.4</span>.</p>
<p id="p-32">Then \(G_1 \simeq G_2\text{.}\) An isomorphism is given by \(\phi(v_1) = v_1,\ \phi(v_2) = v_3,\ \phi(v_3) = v_5,\ \phi(v_4) = v_2,\ \phi(v_5) = v_4\) and \(\phi(v_6) = v_6\text{.}\) \(G_1 \not\simeq G_3\text{,}\) since \(G_3\) contains three pairwise adjacent vertices, whereas \(G_1\) does not. Since we have \(G_1 \simeq G_2\) and \(G_1 \not\simeq G_3\text{,}\) we also have \(G_2 \not\simeq G_3\text{.}\)</p></article></section></div>
</div>
