---
title: "Polyhedra"
shell: tw314-native
sort_order: 17
---

<div class="tw314-native-document" data-tw314-slug="section-polyhedra">
<div id="content" class="pretext-content"><section class="section" id="section-polyhedra"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">2.4</span> <span class="title">Polyhedra</span>
</h2>
<p id="p-69">A polyhedron is a three-dimensional solid which consists of a collection of polygons joined at their edges. Every polyhedron \(P\) is associated with a connected planar graph \(G(P)\) whose vertices and edges are the vertices and edges of \(P\text{.}\) Therefore every vertex of \(G(P)\) has degree at least 3. Also, if \(G(P)\) is a plane graph, then the faces of \(P\) are the regions of \(G(P)\) and every edge of \(G(P)\) is on the boundary of two regions.</p>
<p id="p-70">Let \(G\) be a plane graph of a polyhedron. We construct a second graph \(G^*\) as follows (see <span class="xref">Figure 2.4.1</span>). Corresponding to each region \(R\) of \(G\) there is a vertex \(R^*\) of \(G^*\text{,}\) and corresponding to each edge \(e\) of \(G\) there is an edge \(e^*\) of \(G^*\text{.}\) Two vertices \(R_1^*\) and \(R_2^*\) are joined by the edge \(e^*\) in \(G^*\) if and only if their corresponding regions are separated by an edge in \(G\text{.}\) The graph \(G^*\) is called the <dfn class="terminology">dual</dfn> of \(G\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-duality"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_duality.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.4.1<span class="period">.</span></span><span class="space"> </span>The dual of a graph</figcaption></figure><p id="p-71">Note that any vertex of degree \(d\) in \(G\) becomes a region of degree \(d\) (i.e. a polygon with \(d\) edges) in \(G^*\) and that each region of degree \(D\) in \(G\) becomes a vertex of degree \(D\) in \(G^*\text{.}\)</p>
<p id="p-72">Applying <span class="xref">Theorem 2.3.3</span> to the dual of a graph gives us the following result for 3-regular graphs.</p>
<article class="theorem theorem-like" id="theorem-graph-regions"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.4.2</span><span class="period">.</span>
</h6>Let \(G\) be a 3-regular graph of order \(p \geq 4\text{,}\) and let \(r_i\) denote the number of regions of degree \(i\) in \(G\text{,}\) for \(i = 3,4,5,\cdots \) Then<div class="displaymath">
\begin{equation*}
3r_3 + 2r_4 + r_5 = 12 + r_7 +2r_8 + \cdots + (i-6)r_i + \cdots 
\end{equation*}
</div></article><p id="p-73">A <dfn class="terminology">regular polyhedron</dfn> is a polyhedron whose faces are bounded by congruent regular polygons with the same number of faces meeting at each vertex. In particular, for a regular polyhedron, the degrees of its regions (faces) is a fixed number \(m\) and the degrees of its vertices is a fixed number \(n\text{.}\) For example, a cube has \(m=4\) and \(n=3\text{.}\) There are only five other regular polyhedra. These five regular polyhedra are also known as the <dfn class="terminology">platonic solids</dfn>.</p>
<article class="theorem theorem-like" id="theorem-graph-solids"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">2.4.3</span><span class="period">.</span>
</h6>There are exactly five platonic solids.</article><article class="hiddenproof" id="proof-9"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-9"><article class="hiddenproof"><p id="p-74">Let \(P\) be a regular polyhedron and let \(G(P)\) be an associated plane graph. Let \(p, q\) and \(r\) be the number of vertices, edges and regions, and let \(m\) be the degree of each region and \(n\) the degree of each vertex.</p>
<p id="p-75">By counting the degrees of the regions over all the regions, we get \(2q = mr\) and by counting the degrees of the vertices over all vertices, we get \(2q = np\text{.}\)</p>
<p id="p-76">Therefore, by Euler's theorem, we have</p>
<div class="displaymath">
\begin{align*}
0 &lt; 2 = p-q+r&amp; = \frac{2q}{n} - q + \frac{2q}{m}\\
&amp; = q\left( \frac{2m - mn + 2n}{mn} \right)
\end{align*}
</div>
<p id="p-77">Therefore</p>
<div class="displaymath">
\begin{align*}
2m - mn + 2n&amp; &gt; 0 \text{, and so}\\
mn - 2m - 2n&amp;&lt; 0 \text{, and therefore}\\
(m-2)(n-2)&amp; &lt; 4.
\end{align*}
</div>
<p id="p-78">Since \(m,n \geq 3\text{,}\) \((m-2),(n-2) &gt; 0\text{;}\) hence we have only five solutions:</p>
<ol id="p-79" class="decimal">
<li id="li-3">
<p id="p-80">\(m-2 = 1\) and \(n-2 = 1\)</p>
<p id="p-81">Therefore \(m=3\) and \(n=3\text{.}\) From <span class="xref">Theorem 2.3.3</span> \(p=4\) and it follows that \(q=6\) and \(r=4\text{.}\) The given polyhedron is a <dfn class="terminology">tetrahedron</dfn>.</p>
</li>
<li id="li-4">
<p id="p-82">\(m-2 = 2\) and \(n-2 = 1\)</p>
<p id="p-83">Therefore \(m=4\) and \(n=3\text{.}\) From <span class="xref">Theorem 2.4.2</span> \(r=6\) and it follows that \(q=12\) and \(p=8\text{.}\) The given polyhedron is a <dfn class="terminology">cube</dfn>.</p>
</li>
<li id="li-5">
<p id="p-84">\(m-2 = 1\) and \(n-2 = 2\)</p>
<p id="p-85">Therefore \(m=3\) and \(n=4\text{.}\) From <span class="xref">Theorem 2.3.3</span> \(p=6\) and it follows that \(q=12\) and \(r=8\text{.}\) The given polyhedron is a <dfn class="terminology">octahedron</dfn>.</p>
</li>
<li id="li-6">
<p id="p-86">\(m-2 = 3\) and \(n-2 = 1\)</p>
<p id="p-87">Therefore \(m=5\) and \(n=3\text{.}\) From <span class="xref">Theorem 2.4.2</span> \(r=12\) and it follows that \(q=30\) and \(p=20\text{.}\) The given polyhedron is a <dfn class="terminology">dodecahedron</dfn>.</p>
</li>
<li id="li-7">
<p id="p-88">\(m-2 = 1\) and \(n-2 = 3\)</p>
<p id="p-89">Therefore \(m=3\) and \(n=5\text{.}\) From <span class="xref">Theorem 2.3.3</span> \(p=12\) and it follows that \(q=30\) and \(r=20\text{.}\) The given polyhedron is a <dfn class="terminology">icosahedron</dfn>.</p>
</li>
</ol>
<p id="p-90">These are all the platonic solids.</p></article></div>
<article class="example example-like" id="example-graph-regularplane"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.4.4</span><span class="period">.</span>
</h6>Does there exist 3-regular plane graphs with no 3-cycles or 4-cycles?<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-7"><div class="solution solution-like">
<p id="p-91">Any 3-regular plane graph must have a region of degree at most five, i.e. it must have a 3-cycle, a 4-cycle or a 5-cycle. If it has no 3-cycles or 4-cycles, it must have at least 12 5-cycles. Plane 3-regular graphs with exactly 12 5-cycles are, for example, the graphs of the dodecahedron and the truncated icosahedron.</p>
<figure class="figure figure-like" id="figure-graph-bucky"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_bucky.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.4.5<span class="period">.</span></span><span class="space"> </span>The truncated icosahedron</figcaption></figure>
</div></div>
</div></article></section></div>
</div>
