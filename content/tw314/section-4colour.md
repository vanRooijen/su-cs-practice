---
title: "The four-colour problem"
shell: tw314-native
sort_order: 23
---

<div class="tw314-native-document" data-tw314-slug="section-4colour">
<div id="content" class="pretext-content"><section class="section" id="section-4colour"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">3.3</span> <span class="title">The four-colour problem</span>
</h2>
<p id="p-231">Can every planar graph be 4-coloured?</p>
<p id="p-232">1852: DeMorgen writes to Hamilton - says some student named Frederick Guthrie posed him the question. Frederich got the problem from his brother Francis Guthrie (later a professor in Maths at the South African University College, Cape Town). This letter was dated 23 October 1952.</p>
<p id="p-233">Hamilton reply (26 October 1952): “I am not likely to attempt your 'quaternion of colours' very soon”.</p>
<p id="p-234">1879: Alfred Bray Kempe “proves” that all planar graphs are 4-colourable - “Proof” appears in American Journal of Mathematics. It is accepted as correct - Kempe is made a “Fellow of the Royal Society”.</p>
<p id="p-235">1890: Percy John Heawood find a fault in Kempe's proof. Modify Kempe's proof to prove that every planar graph is 5-colourable.</p>
<p id="p-236">1976: Appel &amp; Haken finally proves 4-colour theorem - long, many cases, 1200 hours of computer time!</p>
<p id="p-237">Before we look at the 4-colour theorem, let's first consider planar graph colourings in general.</p>
<article class="lemma theorem-like" id="lemma-planar-degree"><h6 class="heading">
<span class="type">Lemma</span><span class="space"> </span><span class="codenumber">3.3.1</span><span class="period">.</span>
</h6>For any planar graph \(G\text{,}\) \(\delta\leq 5\text{.}\)</article><article class="hiddenproof" id="proof-14"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-14"><article class="hiddenproof"><p id="p-238">Let \(G\) be a planar graph of order \(p\) and size \(q\text{.}\) If \(deg(v) \geq 6\) for all \(v \in V(G)\text{,}\) then \(2q= \sum{deg(v)} \geq 6p\text{;}\) hence \(q \geq 3p\text{.}\) This contradicts the fact that  \(q \leq 3p -6\text{.}\)</p></article></div>
<article class="theorem theorem-like" id="theorem-17"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.3.2</span><span class="period">.</span>
</h6>Every planar graph is 6-colourable.</article><article class="hiddenproof" id="proof-15"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-15"><article class="hiddenproof"><p id="p-239"><em class="emphasis">By induction on the order \(p\text{:}\)</em></p>
<p id="p-240">The result is clearly true if \(1 \leq p \leq 6\text{.}\) For the induction hypothesis, assume that all planar graphs of order \(p\) (\(p &gt; 6\)) are 6-colourable. Now let \(G\) be a planar graph of order \(p + 1\text{,}\) and embed \(G\) in the plane.</p>
<p id="p-241">From <span class="xref">Lemma 3.3.1</span> there exist a vertex \(v\) with \(\deg(v)\leq 5\text{.}\) Then \(G-v\) has order \(p\) and is 6-colourable from the induction hypothesis. Since \(v\) has at most 5 neighbours, there is a colour availablefor \(v\) and \(G\) is 6-colourable.</p></article></div>
<article class="theorem theorem-like" id="theorem-18"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.3.3</span><span class="period">.</span>
</h6>Every planar graph is 5-colourable.</article><article class="hiddenproof" id="proof-16"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-16"><article class="hiddenproof"><p id="p-242"><em class="emphasis">By induction on the order \(p\text{:}\)</em></p>
<p id="p-243">The result is clearly true if \(1 \leq p \leq 5\text{.}\) For the induction hypothesis, assume that all planar graphs of order \(p\) (\(p \geq 5\)) are 5-colourable. Now let \(G\) be a planar graph of order \(p + 1\text{,}\) and embed \(G\) in the plane. From <span class="xref">Lemma 3.3.1</span> \(G\) contains a vertex \(v\) with \(deg(v) \leq 5\text{.}\) Since th graph \(G-v\) is a planar graph of order \(p\text{,}\) it follows from the induction hypothesis that \(G-v\) is 5-colourable.</p>
<p id="p-244">Consider a 5-colouring of \(G-v\) in the colours 1, 2, 3, 4 and 5. If one of these colours is not used in colouring the neighbours of \(v\text{,}\) then this colour may be assigned to \(v\text{,}\) producing a 5-colouring of \(G\text{.}\) Thus, we may assume that \(deg(v) = 5\) and that all five colours are used to colour the neighbours of \(v\text{.}\)</p>
<p id="p-245">Suppose that the neighbours of \(v\) are \(v_1, v_2, v_3, v_4\) and \(v_5\text{,}\) arranged cyclically about \(v\text{.}\) Suppose also that they have been coloured in the colours 1,2,3,4 and 5 respectively. We now show that we can recolour some vertices of \(G-v\text{,}\) including a neighbour of \(v\text{,}\) so that a colour becomes available for \(v\text{.}\)</p>
<p id="p-246">Let \(H_{1,3}\) be the subgraph of \(G-v\) induced by all vertices coloured 1 or 3, and let \(H_{2,4}\) be the subgraph of \(G-v\) induced by all vertices coloured 2 or 4. There exists no \(v_1\)-\(v_3\) path in \(H_{1,3}\) or no \(v_2\)-\(v_4\) path in \(H_{2,4}\text{,}\) for otherwise there would exist a vertex \(w\) coloured 1 or 3 as well as 2 or 4, which is impossible.</p>
<p id="p-247">Assume without loss of generality that there exists no \(v_1\)-\(v_3\) path in \(H_{1,3}\text{.}\) Consider all paths starting at \(v_1\) all of whose vertices are coloured 1 or 3. These paths produce a subgraph \(H\) of \(H_{1,3}\text{.}\) Now interchange the colours of the vertices of \(H\) to produce a different 5-colouring of \(G-v\text{.}\) This 5-colouring assigns the colour 3 to both \(v_1\) and \(v_3\text{.}\) We may now assign colour 1 to vertex \(v\text{,}\) which produces a 5-colouring of \(G\text{.}\)</p></article></div>
<article class="theorem theorem-like" id="theorem-19"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.3.4</span><span class="period">.</span><span class="space"> </span><span class="title">Grötzsch's Theorem.</span>
</h6>Every planar triangle-free graph is 3-colourable.</article>

<span><p id="faulty-text">We conclude this section with the famous result. Remember that this theorem was proved by Appel and Haken with a computer-assisted proof. Below you will find the incorrect proof of Kempe. As a challenge, see if you can see why this proof is not correct.</p></span>

<article class="theorem theorem-like" id="theorem-20"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">3.3.5</span><span class="period">.</span>

</h6>Every planar graph is 4-colourable.</article><article class="hiddenproof" id="proof-17"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-17"><article class="hiddenproof"><p id="p-248"><em class="alert">Faulty proof</em></p>
<p id="p-249"><em class="emphasis">By induction on the order \(p\text{:}\)</em></p>
<p id="p-250">The result is clearly true if \(1 \leq p \leq 4\text{.}\) For the induction hypothesis, assume that all planar graphs of order \(p\) (\(p \geq 4\)) are 4-colourable. Now let \(G\) be a planar graph of order \(p+1\text{,}\) and embed \(G\) in the plane. Since \(G\) is planar, it has a vertex \(v\) with \(deg(v) \leq 5\text{.}\) Since the graph \(G-v\) is a planar graph of order \(p\text{,}\) it follows from the induction hypothesis that \(G-v\) is 4-colourable. Consider a 4-colouring of \(G-v\) in the colours 1,2,3 and 4. If one of these colours is not used in colouring the neighbours of \(v\text{,}\) then this colour may be assigned to \(v\text{,}\) producing a 4-colouring of \(G\text{.}\) Thus, we may assume that \(deg(v) = 4\) or 5 and that all four colours are used to coloud the neighbours of \(v\text{.}\)</p>
<p id="p-251"><em class="emphasis">Case 1:</em> If \(deg(v) = 4\text{.}\)</p>
<p id="p-252">Suppose the neighbours of \(v\) are \(v_1, v_2, v_3\) and \(v_4\text{,}\) arranged cyclically about \(v\text{.}\) Suppose also that they have been coloured in the colours 1,2,3 and 4 respectively. It is not possible for there to be both a \(v_1-v_3\) path in \(H_{1,3}\) as well as a \(v_2-v_4\) path in \(H_{2,4}\text{.}\) Assume without loss of generality that there is no \(v_1-v_3\) path in \(H_{1,3}\text{.}\) Interchange the colours on all paths in \(H_{1,3}\) that starts at \(v_3\text{.}\) Then \(v_3\) has colour 1; hence colour 3 becomes available for \(v\text{.}\)</p>
<p id="p-253"><em class="emphasis">Case 2:</em> If \(deg(v) = 5\text{.}\)</p>
<p id="p-254">Suppose the neighbours of \(v\) are \(a,b,c,d\) and \(e\text{,}\) arranged cyclically about \(v\text{.}\) There are, without loss of generality, two subcases to consider,</p>
<p id="p-255"><em class="emphasis">Subcase 2(a):</em> The vertices \(a,b,c,d,e\) received colours 4,1,2,3,4 respectively. It is not possible for there to be both a \(b-d\) path in \(H_{1,3}\) as well as a \(c-e\) path in \(H_{2,4}\text{.}\) If there is no \(b-d\) path in \(H_{1,3}\text{,}\) interchange the colours on all paths in \(H_{1,3}\) that starts at \(d\text{.}\) This makes colour 3 available for \(v\text{.}\) If there exists no \(c-e\) path in \(H_{2,4}\text{,}\) interchange the colours on all paths in \(H_{2,4}\) that starts at \(c\text{.}\) This makes colours 2 available for \(v\text{.}\)</p>
<p id="p-256"><em class="emphasis">Subcase 2(b):</em> The vertices \(a,b,c,d,e\) received colours 1,4,2,3,4 respectively.  If there is no \(a-c\) path in \(H_{1,2}\text{,}\) then interchange the colours on all paths that start at \(c\) to make colour 2 available for \(v\text{.}\) Similarly, if there is no \(a-d\) path in \(H_{1,3}\text{,}\) then interchange the colours on all paths in \(H_{1,3}\) that start at \(d\) to make colour 3 available for \(v\text{.}\) Therefore there must be both an \(a-c\) path in \(H_{1,2}\) and an \(a-c\) path in \(H_{1,3}\text{.}\)</p>
<p id="p-257">It follows that there can be no \(b-d\) path in \(H_{3,4}\) and no \(e-c\) path in \(H_{,4}\text{.}\) If we now interchange colours on all \(b-d\) paths in \(H_{3,4}\) starting at \(b\text{,}\) and we interchange colours on all \(e-c\) paths in \(H_{2,4}\) starting at \(e\text{,}\) \(b\) and \(e\) then have colours 3 and 2 respectively, so that colour 4 becomes available for \(v\text{.}\)</p></article></div>



</section></div>
</div>
