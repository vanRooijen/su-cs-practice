---
title: "Bounds on the chromatic number"
shell: tw314-native
sort_order: 22
---

<div class="tw314-native-document" data-tw314-slug="section-bounds">
<div id="content" class="pretext-content"><section class="section" id="section-bounds"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">3.2</span> <span class="title">Bounds on the chromatic number</span>
</h2>
<p id="p-207">A <dfn class="terminology">clique</dfn> in a graph \(G\) is a maximal complete subgraph of \(G\text{.}\) The <dfn class="terminology">clique number</dfn> \(\omega (G)\) of \(G\) is the order of a largest clique of \(G\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-clique"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_4colouring.JPG" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">3.2.1<span class="period">.</span></span><span class="space"> </span>A graph with a clique number of 4.</figcaption></figure><article class="example example-like" id="example-graph-clique"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">3.2.2</span><span class="period">.</span>
</h6>Determine all the cliques of \(G\) in <span class="xref">Figure 3.2.1</span> and then deduce the \(\omega(G)\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-12"><div class="solution solution-like">
<p id="p-208">The cliques of \(G\) are:</p>
<div class="displaymath" id="p-209">
\begin{align*}
\left\langle \{ u,r,v \} \right\rangle, \left\langle \{ u,x,v \} \right\rangle &amp; \text{ of order } 3 \\
\left\langle \{ u,s,w \} \right\rangle, \left\langle \{ u,x,w \} \right\rangle &amp; \text{ of order } 3 \\
\left\langle \{ w,t,v \} \right\rangle, \left\langle \{ w,x,v \} \right\rangle &amp; \text{ of order } 3 \\
\left\langle \{ u,v,w,x \} \right\rangle &amp; \text{ of order } 4 
\end{align*}
</div>
<p id="p-210">Hence the clique number is \(\omega(G) = 4\text{.}\)</p>
</div></div>
</div></article><p id="p-211">In any colouring of a graph \(G\text{,}\) all vertices in a clique must get different colours; hence the following result</p>
<article class="theorem theorem-like" id="theorem-13"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.2.3</span><span class="period">.</span>
</h6>For any graph \(G\text{,}\)<div class="displaymath">
\begin{equation*}
\omega(G) \leq \chi(G).
\end{equation*}
</div></article><p id="p-212">However, this lower bound for \(\chi(G)\) is not a very good one. For example, odd cycles have \(\omega = 2\) and \(\chi = 3\text{.}\) In fact, we can construct, for any \(k = 3,4, \ldots\text{,}\) \(k\)-chromatic graphs that are triangle-free, so that \(\chi - \omega\) can be made arbitrarily large.</p>
<p id="p-213">In 1955 Jan Mycielski constructed a class of graphs for which the clique number is two, but where the chromatic number can be arbitrarily large. The <dfn class="terminology">Mycielskian</dfn> \(\mu(G)\) of the graph \(G\text{,}\) on vertices \(v_1,\dots,v_n\text{,}\) has \(2n+1\) vertices and contains \(G\) as an induced subgraph. The vertex set of \(\mu(G)\) consist of the vertices \(v_i\text{,}\) a corresponding vertex \(u_i\) for every \(i=1,\dots,n\) and the vertex \(w\text{.}\) The edge set of \(\mu(G)\) contains the following edges: \(u_iv\) for each \(v\in N_G(v_i)\) and \(i=1,\dots,n\text{,}\) and \(u_iw\) for each \(i=1,\dots,n\text{.}\) Note that the graph induced by all the \(u_i\)'s and \(w\) is isomorphic to the star \(K_{1,n}\text{.}\)</p>
<p id="p-214">The Mycielskian \(\mu(G)\) contains a triangle if and only if the graph \(G\) contains a triangle. Hence, if we start with a triangle-free graph, we can use the construction to create larger triangle-free graphs. More specifically, if we start with the complete graph of order two and apply the Mycielskian construction iteratively, then we create a sequence of triangle-free graphs where the chromatic number increases by one with every iteration. This sequence of graphs is called <dfn class="terminology">Mycielski graphs</dfn> where \(M_i=\mu(M_{i-1})\) and \(M_2=K_2\text{.}\)</p>
<article class="example example-like" id="example-graph-mycielski"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">3.2.4</span><span class="period">.</span>
</h6>Construct the Mycielski graphs \(M_3\) and \(M_4\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-13"><div class="solution solution-like">
<p id="p-215">The third Mycielski graph is isomorphic to a 5-cycle.</p>
<figure class="figure figure-like" id="figure-graph-mycielski1"><div class="image-box" style="width: 20%; margin-left: 40%; margin-right: 40%;"><img src="/tw314-assets/images/figure_mycielski1.jpg" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">3.2.5<span class="period">.</span></span><span class="space"> </span>The Mycielski graph \(M_3\simeq C_5\text{.}\)</figcaption></figure><p id="p-216">The fourth Mycielski graph is called the <dfn class="terminology">Grötzsch graph</dfn>.</p>
<figure class="figure figure-like" id="figure-graph-mycielski2"><div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_mycielski2.jpg" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">3.2.6<span class="period">.</span></span><span class="space"> </span>The Grötzsch graph.</figcaption></figure>
</div></div>
</div></article><p id="p-217">An <dfn class="terminology">independent set</dfn> in a graph \(G\) is a set of vertices that are not adjacent to one another. A <dfn class="terminology">maximal independent set</dfn> \(S\) is an independent set that does not remain independent if any vertex not in \(S\) is added to \(S\text{.}\) The <dfn class="terminology">independence number</dfn> \(\alpha(G)\) is the largest possible maximal independet set in \(G\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-independence"><div class="image-box" style="width: 20%; margin-left: 40%; margin-right: 40%;"><img src="/tw314-assets/images/figure_independence.png" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">3.2.7<span class="period">.</span></span><span class="space"> </span>A graph with an independence number of 3.</figcaption></figure><article class="example example-like" id="example-graph-independence"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">3.2.8</span><span class="period">.</span>
</h6>Determine the independence number of the graph \(G_2\) in <span class="xref">Figure 3.2.7</span>.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-14"><div class="solution solution-like"><p id="p-218">Since \(\omega(\overline{G_2})=3\text{,}\) it follows that \(\alpha(G_2)=3\text{.}\)</p></div></div>
</div></article><article class="theorem theorem-like" id="theorem-14"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.2.9</span><span class="period">.</span>
</h6>Let \(G\) be a graph with \(n\) vertices and independence number \(\alpha(G)\text{.}\) Then<div class="displaymath">
\begin{equation*}
\chi(G)\geq \lceil n/\alpha(G) \rceil.
\end{equation*}
</div></article><article class="hiddenproof" id="proof-12"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-12"><article class="hiddenproof"><p id="p-219">Suppose that \(\chi(G)=k\) and let \(V_1,\dots,V_k\) be the colour classes of \(G\text{,}\) where each \(V_i\) is independent. Hence</p>
<div class="displaymath">
\begin{equation*}
n=|V(G)|=|V_1,\cup\dots\cup V_k|=\sum_{i=1}^k|V_i|\leq k\alpha(G).
\end{equation*}
</div>
<p id="p-220">Therefore, \(\chi(G)=k\geq \lceil n/\alpha(G) \rceil\text{.}\)</p></article></div>
<p id="p-221">By following a greedy approach, it will always be possible to colour the vertices of a graph with \(\Delta\) colours.</p>
<article class="algorithm theorem-like" id="algorithm-2"><h6 class="heading">
<span class="type">Algorithm</span><span class="space"> </span><span class="codenumber">3.2.10</span><span class="period">.</span><span class="space"> </span><span class="title">A greedy colouring algorithm.</span>
</h6>
<dl id="p-222" class="description-list">
<dt id="li-48">STEP 1</dt>
<dd><p id="p-223">Colour a vertex with colour 1.</p></dd>
<dt id="li-49">STEP 2</dt>
<dd><p id="p-224">Pick an uncoloured vertex. Colour it with the lowest number colour that has not been used on any of its neighbours. If all the preciously used colours appear on its neighbours, then introduce a new colour.</p></dd>
<dt id="li-50">STEP 3</dt>
<dd><p id="p-225">Repeat STEP 2 until all the vertices are coloured</p></dd>
</dl></article><article class="example example-like" id="example-graph-greedy"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">3.2.11</span><span class="period">.</span>
</h6>Use the greedy algorithm to colour the Grötzsch graph in <span class="xref">Figure 3.2.6</span>.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-15"><div class="solution solution-like">
<p id="p-226">Colour vertex \(w\) with colour 1 (say blue). Now pick vertex \(v_1\text{.}\) Since \(v_1\) is not adjacent to \(w\text{,}\) colour \(v_1\) with colour 1 as well. Since \(v_2\) is adjacent to \(v_2\text{,}\) colour it with colour 2 (say red). Continuing in this way, we colour \(v_3\) with colour 1, \(v_4\) with colour 2. Now we have to introduce a new colour, colour 3 (say yelow), to colour \(v_5\text{.}\) Following the algorithm, if we pick \(u_1\) next, we must colour it with colour 4 (say green) and then the rest will be coloured as follows: \(u_2, u_4\) with colour 2 and \(u_3, u_5\) with colour 3.</p>
<figure class="figure figure-like" id="figure-graph-greedy"><div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_greedy.jpg" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">3.2.12<span class="period">.</span></span><span class="space"> </span>A greedy colouring of the Grötzsch graph.</figcaption></figure>
</div></div>
</div></article><article class="theorem theorem-like" id="theorem-15"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.2.13</span><span class="period">.</span>
</h6>For any connected graph \(G\text{,}\)<div class="displaymath">
\begin{equation*}
\chi(G)\leq \Delta+1.
\end{equation*}
</div></article><article class="hiddenproof" id="proof-13"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-13"><article class="hiddenproof"><p id="p-227">Let \(\Delta\) be the maximum degree of \(G\text{.}\)</p>
<p id="p-228">Then any vertex \(v\) is adjacent to at most \(\Delta\) vertices of which possibly all are coloured differently.</p>
<p id="p-229">Hence there are at most \(\Delta\) colours that should be avoided. Since \(v\) must be coloured different to all its neighbours, we need at most \(\Delta+1\) colours to have a proper colouring of \(G\text{.}\)</p></article></div>
<p id="p-230">We can improve slightly on the previous result by restricting the types of graphs that we are considering.</p>
<article class="theorem theorem-like" id="theorem-16"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.2.14</span><span class="period">.</span><span class="space"> </span><span class="title">Brook's Theorem.</span>
</h6>Let \(G\) be a connected graph. If \(G\) is neither a complete graph nor an odd cycle, then<div class="displaymath">
\begin{equation*}
\chi(G)\leq \Delta.
\end{equation*}
</div></article></section></div>
</div>
