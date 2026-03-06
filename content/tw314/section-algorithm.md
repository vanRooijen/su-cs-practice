---
title: "A planarity algorithm"
shell: tw314-native
sort_order: 19
---

<div class="tw314-native-document" data-tw314-slug="section-algorithm">
<div id="content" class="pretext-content"><section class="section" id="section-algorithm"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">2.6</span> <span class="title">A planarity algorithm</span>
</h2>
<p id="p-100">Let \(H\) be a given subgraph of \(G\text{.}\) Let \(B\subseteq E(G)\backslash E(H)\) such that \(e_1,e_2\in B\) if and only if there exist a walk \(W\) beginning with \(e_1\) and ending with \(e_2\) such that no internal vertex of \(W\) is a vertex of \(H\text{.}\) Then \(B\) is a <dfn class="terminology">bridge of \(H\) in \(G\)</dfn>.</p>
<p id="p-101">The <dfn class="terminology">vertices of attachment of \(B\) to \(H\)</dfn> is the vertices of \(B\) that is also on \(H\text{,}\) \(V(B)\cap V(H)=V(B,H)\text{.}\)</p>
<p id="p-102">A bridge \(B\) of \(H\) is <dfn class="terminology">drawable</dfn> in a face \(f\) of an embedding \(H'\) of \(H\) if the vertices of attachment of \(B\) to \(H\) are contained in the boundary of \(f\text{.}\)</p>
<p id="p-103">The set of faces of an embedding \(H'\) of \(H\) in which \(B\) is drawable is denoted by \(F(B,H')\text{.}\)</p>
<figure class="figure figure-like" id="figure-graph-bridges"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_planar_alg.jpg" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.6.1<span class="period">.</span></span><span class="space"> </span>Find the bridges of \(C=(1,2,3,4,5,6,7,8,1)\) in \(G\text{.}\)</figcaption></figure><article class="example example-like" id="example-graph-bridges"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.6.2</span><span class="period">.</span>
</h6>Determine the bridges of \(C\) in the graph \(G_1\) in <span class="xref">Figure 2.6.1</span>.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-9"><div class="solution solution-like">
<p id="p-104">There are bridges of \(C\) in the graph \(G_1\text{:}\)</p>
<div class="displaymath">
\begin{align*}
B_1 &amp; = {{5,7}} \\
B_2 &amp; = {{3,9},{4,9},{5,9}} \\
B_3 &amp; = {{7,15},{15,16},{15,17}} \\
B_4 &amp; = E(G)\backslash (E(C)\cup B_1\cup B_2 \cup B_3) 
\end{align*}
</div>
</div></div>
</div></article><article class="algorithm theorem-like" id="algorithm-1"><h6 class="heading">
<span class="type">Algorithm</span><span class="space"> </span><span class="codenumber">2.6.3</span><span class="period">.</span><span class="space"> </span><span class="title">A planarity algorithm.</span>
</h6>
<dl id="p-105" class="description-list">
<dt id="li-8">STEP 1</dt>
<dd>
<p id="p-106">Let \(G_1\) be a cycle of \(G\text{.}\)</p>
<p id="p-107">Let \(G_1'\) be an embedding of \(G_1\text{.}\)</p>
<p id="p-108">Set \(i=1\text{.}\)</p>
</dd>
<dt id="li-9">STEP 2</dt>
<dd>
<p id="p-109">IF \(E(G)\backslash E(G_i)=\varnothing\text{,}\) \(G\) is planar STOP.</p>
<p id="p-110">ELSE Determine all the bridges of \(G_i\) in \(G\) and find \(F(B,G_i')\) for each bridge.</p>
</dd>
<dt id="li-10">STEP 3</dt>
<dd>
<p id="p-111">IF there exist a bridge \(B\) such that \(F(B,G_i')=\varnothing\text{,}\) \(G\) is non-planar, STOP.</p>
<p id="p-112">ELSEIF there exist a bridge \(B\) such that \(|F(B,G_i')|=1\text{,}\) let \(f=F(B,G_i')\text{,}\)</p>
<p id="p-113">ELSE let \(B\) be any bridge and \(f\in F(B,G_i')\text{.}\)</p>
</dd>
<dt id="li-11">STEP 4</dt>
<dd>
<p id="p-114">Choose a path \(P_i\subseteq B\) connecting two vertices of attachement of \(B\) to \(G_i\text{.}\)</p>
<p id="p-115">Let \(G_{i+1}\) be the graph \(G_i\) together with \(P_i\text{.}\)</p>
<p id="p-116">Obtain a planar embedding of \(G_{i+1}'\) of \(G_{i+1}\text{,}\) by drawing \(P_i\) in the face \(f\) of \(G_i'\text{.}\)</p>
</dd>
<dt id="li-12">STEP 5</dt>
<dd><p id="p-117">Set \(i=i+1\) and go to STEP 2.</p></dd>
</dl></article><figure class="figure figure-like" id="figure-graph-planar1"><div class="image-box" style="width: 70%; margin-left: 15%; margin-right: 15%;"><img src="/tw314-assets/images/figure_planar_alg2.jpg" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">2.6.4<span class="period">.</span></span><span class="space"> </span>The graphs \(G\) and \(H\text{.}\)</figcaption></figure><article class="example example-like" id="example-graph-planar2"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">2.6.5</span><span class="period">.</span>
</h6>Make use of the planarity algorithm to determine whether graphs \(G\) and \(H\) in <span class="xref">Figure 2.6.4</span> are planar.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-10"><div class="solution solution-like">
<em class="alert">For the graph \(G\text{:}\)</em><p id="p-118"><em class="alert">Initialisation</em>: Choose the cycle \(G_1=(1,2,3,5,6,1)\) and embed it in the plane as \(G_1'\text{.}\) Set \(i=1\text{.}\)</p>
<div class="image-box" style="width: 30%; margin-left: 35%; margin-right: 35%;"><img src="/tw314-assets/images/figure_planar_G1.jpg" style="width: 100%; height: auto;" alt=""></div>
<p id="p-119">\(i=1:\)</p>
<dl id="p-120" class="description-list">
<dt id="li-13">STEP 2</dt>
<dd>
<p id="p-121">\(E(G)\backslash E(G_1)\neq\varnothing\text{.}\)</p>
<p id="p-122">There are 5 bridges of \(G_1'\) in the graph \(G\text{:}\)</p>
<div class="displaymath" id="p-123">
\begin{align*}
&amp;B_1 = \{13\}; F(B_1,G_1')=\{f_1,f_2\}  \\
&amp;B_2 = \{26\};  F(B_2,G_1')=\{f_1,f_2\}\\
&amp;B_3 = \{25\};  F(B_3,G_1')=\{f_1,f_2\}\\
&amp;B_4 = \{36\};  F(B_4,G_1')=\{f_1,f_2\}\\
&amp;B_5 = \{14,24,34\};  F(B_5,G_1')=\{f_1,f_2\}
\end{align*}
</div>
</dd>
<dt id="li-14">STEP 3</dt>
<dd><p id="p-124">Choose \(B_1\) and let \(f=f_2\text{.}\)</p></dd>
<dt id="li-15">STEP 4</dt>
<dd>
<p id="p-125">Let \(P_1=(1,3)\text{.}\)</p>
<p id="p-126">Draw \(G_2'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_G2.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-16">STEP 5</dt>
<dd><p id="p-127">Set \(i=2\) and go to STEP 2.</p></dd>
</dl>
<p id="p-128">\(i=2:\)</p>
<dl id="p-129" class="description-list">
<dt id="li-17">STEP 2</dt>
<dd>
<p id="p-130">\(E(G)\backslash E(G_2)\neq\varnothing\text{.}\)</p>
<p id="p-131">There are 4 bridges of \(G_2'\) in the graph \(G\text{:}\)</p>
<div class="displaymath" id="p-132">
\begin{align*}
&amp;B_2 = \{26\};  F(B_2,G_2')=\{f_1\}\\
&amp;B_3 = \{25\};  F(B_3,G_2')=\{f_1\}\\
&amp;B_4 = \{36\};  F(B_4,G_2')=\{f_1,f_3\}\\
&amp;B_5 = \{14,24,34\};  F(B_5,G_2')=\{f_1,f_2\}
\end{align*}
</div>
</dd>
<dt id="li-18">STEP 3</dt>
<dd><p id="p-133">Choose \(B_2\) and let \(f=f_1\text{.}\)</p></dd>
<dt id="li-19">STEP 4</dt>
<dd>
<p id="p-134">Let \(P_1=(2,6)\text{.}\)</p>
<p id="p-135">Draw \(G_3'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_G3.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-20">STEP 5</dt>
<dd><p id="p-136">Set \(i=3\) and go to STEP 2.</p></dd>
</dl>
<p id="p-137">\(i=3:\)</p>
<dl id="p-138" class="description-list">
<dt id="li-21">STEP 2</dt>
<dd>
<p id="p-139">\(E(G)\backslash E(G_3)\neq\varnothing\text{.}\)</p>
<p id="p-140">There are 3 bridges of \(G_3'\) in the graph \(G\text{:}\)</p>
<div class="displaymath" id="p-141">
\begin{align*}
&amp;B_3 = \{25\};  F(B_3,G_3')=\{f_1\}\\
&amp;B_4 = \{36\};  F(B_4,G_3')=\{f_1,f_3\}\\
&amp;B_5 = \{14,24,34\};  F(B_5,G_3')=\{f_2\}
\end{align*}
</div>
</dd>
<dt id="li-22">STEP 3</dt>
<dd><p id="p-142">Choose \(B_3\) and let \(f=f_1\text{.}\)</p></dd>
<dt id="li-23">STEP 4</dt>
<dd>
<p id="p-143">Let \(P_1=(2,5)\text{.}\)</p>
<p id="p-144">Draw \(G_4'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_G4.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-24">STEP 5</dt>
<dd><p id="p-145">Set \(i=4\) and go to STEP 2.</p></dd>
</dl>
<p id="p-146">\(i=4:\)</p>
<dl id="p-147" class="description-list">
<dt id="li-25">STEP 2</dt>
<dd>
<p id="p-148">\(E(G)\backslash E(G_4)\neq\varnothing\text{.}\)</p>
<p id="p-149">There are 2 bridges of \(G_4'\) in the graph \(G\text{:}\)</p>
<div class="displaymath" id="p-150">
\begin{align*}
&amp;B_4 = \{36\};  F(B_4,G_4')=\{f_3\}\\
&amp;B_5 = \{14,24,34\};  F(B_5,G_4')=\{f_2\}
\end{align*}
</div>
</dd>
<dt id="li-26">STEP 3</dt>
<dd><p id="p-151">Choose \(B_4\) and let \(f=f_3\text{.}\)</p></dd>
<dt id="li-27">STEP 4</dt>
<dd>
<p id="p-152">Let \(P_1=(3,6)\text{.}\)</p>
<p id="p-153">Draw \(G_5'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_G5.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-28">STEP 5</dt>
<dd><p id="p-154">Set \(i=5\) and go to STEP 2.</p></dd>
</dl>
<p id="p-155">\(i=5:\)</p>
<dl id="p-156" class="description-list">
<dt id="li-29">STEP 2</dt>
<dd>
<p id="p-157">\(E(G)\backslash E(G_5)\neq\varnothing\text{.}\)</p>
<p id="p-158">There is 1 bridges of \(G_5'\) in the graph \(G\text{:}\)</p>
<div class="displaymath" id="p-159">
\begin{align*}
&amp;B_5 = \{14,24,34\};  F(B_5,G_5')=\{f_2\}
\end{align*}
</div>
</dd>
<dt id="li-30">STEP 3</dt>
<dd><p id="p-160">Choose \(B_5\) and let \(f=f_2\text{.}\)</p></dd>
<dt id="li-31">STEP 4</dt>
<dd>
<p id="p-161">Let \(P_1=(1,4,2)\text{.}\)</p>
<p id="p-162">Draw \(G_6'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_G6.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-32">STEP 5</dt>
<dd><p id="p-163">Set \(i=6\) and go to STEP 2.</p></dd>
</dl>
<p id="p-164">\(i=6:\)</p>
<dl id="p-165" class="description-list">
<dt id="li-33">STEP 2</dt>
<dd>
<p id="p-166">\(E(G)\backslash E(G_6)\neq\varnothing\text{.}\)</p>
<p id="p-167">There is 1 bridges of \(G_6'\) in the graph \(G\text{:}\)</p>
<div class="displaymath" id="p-168">
\begin{align*}
&amp;B_6 = \{34\};  F(B_6,G_6')=\{f_2\}
\end{align*}
</div>
</dd>
<dt id="li-34">STEP 3</dt>
<dd><p id="p-169">Choose \(B_6\) and let \(f=f_2\text{.}\)</p></dd>
<dt id="li-35">STEP 4</dt>
<dd>
<p id="p-170">Let \(P_1=(3,4)\text{.}\)</p>
<p id="p-171">Draw \(G_7'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_G7.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-36">STEP 5</dt>
<dd><p id="p-172">Set \(i=7\) and go to STEP 2.</p></dd>
</dl>
<p id="p-173">\(i=7:\)</p>
<dl id="p-174" class="description-list">
<dt id="li-37">STEP 2</dt>
<dd><p id="p-175">\(E(G)\backslash E(G_7)=\varnothing\text{,}\) hence \(G\) is planar.</p></dd>
</dl>
<em class="alert">For the graph \(H\text{:}\)</em><p id="p-176"><em class="alert">Initialisation</em>: Choose the cycle \(G_1=(1,2,3,4,5,1)\) and embed it in the plane as \(H_1'\text{.}\) Set \(i=1\text{.}\)</p>
<div class="image-box" style="width: 30%; margin-left: 35%; margin-right: 35%;"><img src="/tw314-assets/images/figure_planar_H1.jpg" style="width: 100%; height: auto;" alt=""></div>
<p id="p-177">\(i=1:\)</p>
<dl id="p-178" class="description-list">
<dt id="li-38">STEP 2</dt>
<dd>
<p id="p-179">\(E(H)\backslash E(H_1)\neq\varnothing\text{.}\)</p>
<p id="p-180">There are 4 bridges of \(H_1'\) in the graph \(H\text{:}\)</p>
<div class="displaymath" id="p-181">
\begin{align*}
&amp;B_1 = \{14\}; F(B_1,H_1')=\{f_1,f_2\}  \\
&amp;B_2 = \{35\};  F(B_2,H_1')=\{f_1,f_2\}\\
&amp;B_3 = \{36,46,56\};  F(B_3,H_1')=\{f_1,f_2\}\\
&amp;B_4 = \{17,27,37,47,57\};  F(B_4,H_1')=\{f_1,f_2\}
\end{align*}
</div>
</dd>
<dt id="li-39">STEP 3</dt>
<dd><p id="p-182">Choose \(B_1\) and let \(f=f_1\text{.}\)</p></dd>
<dt id="li-40">STEP 4</dt>
<dd>
<p id="p-183">Let \(P_1=(1,4)\text{.}\)</p>
<p id="p-184">Draw \(H_2'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_H2.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-41">STEP 5</dt>
<dd><p id="p-185">Set \(i=2\) and go to STEP 2.</p></dd>
</dl>
<p id="p-186">\(i=2:\)</p>
<dl id="p-187" class="description-list">
<dt id="li-42">STEP 2</dt>
<dd>
<p id="p-188">\(E(H)\backslash E(H_2)\neq\varnothing\text{.}\)</p>
<p id="p-189">There are 3 bridges of \(H_2'\) in the graph \(H\text{:}\)</p>
<div class="displaymath" id="p-190">
\begin{align*}
&amp;B_2 = \{35\};  F(B_2,H_2')=\{f_1\}\\
&amp;B_3 = \{36,46,56\};  F(B_3,H_2')=\{f_1\}\\
&amp;B_4 = \{17,27,37,47,57\};  F(B_4,H_2')=\{f_1\}
\end{align*}
</div>
</dd>
<dt id="li-43">STEP 3</dt>
<dd><p id="p-191">Choose \(B_2\) and let \(f=f_1\text{.}\)</p></dd>
<dt id="li-44">STEP 4</dt>
<dd>
<p id="p-192">Let \(P_1=(3,5)\text{.}\)</p>
<p id="p-193">Draw \(H_3'\text{.}\)</p>
<div class="image-box" style="width: 40%; margin-left: 30%; margin-right: 30%;"><img src="/tw314-assets/images/figure_planar_H3.jpg" style="width: 100%; height: auto;" alt=""></div>
</dd>
<dt id="li-45">STEP 5</dt>
<dd><p id="p-194">Set \(i=3\) and go to STEP 2.</p></dd>
</dl>
<p id="p-195">\(i=3:\)</p>
<dl id="p-196" class="description-list">
<dt id="li-46">STEP 2</dt>
<dd>
<p id="p-197">\(E(H)\backslash E(H_3)\neq\varnothing\text{.}\)</p>
<p id="p-198">There are 2 bridges of \(H_3'\) in the graph \(H\text{:}\)</p>
<div class="displaymath" id="p-199">
\begin{align*}
&amp;B_3 = \{36,46,56\};  F(B_3,H_3')=\{f_4\}\\
&amp;B_4 = \{17,27,37,47,57\};  F(B_4,H_3')=\varnothing
\end{align*}
</div>
</dd>
<dt id="li-47">STEP 3</dt>
<dd><p id="p-200">Since \(F(B_4,H_3')=\varnothing\text{,}\) \(H\) is not planar.</p></dd>
</dl>
</div></div>
</div></article></section></div>
</div>
