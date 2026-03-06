---
title: "Decoding with a linear code"
shell: tw314-native
sort_order: 59
---

<div class="tw314-native-document" data-tw314-slug="section-coding-decode">
<div id="content" class="pretext-content"><section class="section" id="section-coding-decode"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">9.5</span> <span class="title">Decoding with a linear code</span>
</h2>
<p id="p-559">We use a nearest neighbour decoding scheme that makes use of the fact that a linear code is a subgroup of the additive group \(V(n,q)\text{.}\) If a codeword \({\bf x}\) is sent through the channel and vector \({\bf y}\) is received, the error vector is \({\bf e}={\bf y}-{\bf x}\text{.}\)</p>
<p id="p-560">A <dfn class="terminology">standard array</dfn> for a code is an array of all vectors of \(V(n,q)\text{,}\) where the first column is the coset leaders of \(C\text{.}\)</p>
<p id="p-561">Use the standard array to decode as follows: A vector \({\bf y}\) is received. Then \({\bf y}\) belongs to some coset \({\bf e}+C\) of \(C\text{,}\) i.e. \({\bf y}={\bf e}+{\bf x}\) with \({\bf e}\) a coset leader and \({\bf x}\) a codeword. Consider \({\bf e}\) to be the error and decode \({\bf x}={\bf y}-{\bf e}\text{.}\)</p>
<article class="example example-like" id="example-coding-decode"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">9.5.1</span><span class="period">.</span><span class="space"> </span><span class="title">Decoding with standard array.</span>
</h6>Let \(C\) be the binary \([4,2]\)-code with generator matrix<div class="displaymath">
\begin{equation*}
\begin{bmatrix}
1&amp;0&amp;1&amp;1\\
0&amp;1&amp;0&amp;1
\end{bmatrix}.
\end{equation*}
</div>Decode the received vector \({\bf y}=1001\text{.}\)<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-47"><div class="solution solution-like">Then \(C=\{0000,1011,0101,1110\}\text{.}\) Choose a vector with minimum weight not in \(C\text{,}\) say \(1000\text{.}\) Then<div class="displaymath">
\begin{equation*}
1000+C=\{1000,0011,1101,0110\}.
\end{equation*}
</div>Choose a vector with minimum weight not in \(C\) or \(1000+C\text{.}\) Then<div class="displaymath">
\begin{equation*}
0100+C=\{0100,1111,0001,1010\}.
\end{equation*}
</div>Choose a vector with minimum weight not in \(C\text{,}\) \(1000+C\) or \(0100+C\text{.}\) Then<div class="displaymath">
\begin{equation*}
0010+C=\{0010,1001,0111,1100\}\text{.}
\end{equation*}
</div>Now form the standardarray:<div class="displaymath">
\begin{equation*}
\begin{matrix}
\text{codewords}&amp;\rightarrow&amp;0000 &amp; \underline{1011} &amp; 0101 &amp; 1110\\
&amp;&amp; 1000 &amp; 0011 &amp; 1101 &amp; 0110 \\
&amp;&amp; 0100 &amp; 1111 &amp; 0001 &amp; 1010 \\
&amp;&amp; \underline{0010} &amp; {\bf 1001} &amp; 0111 &amp; 1100 \\
&amp;&amp; \uparrow &amp;&amp;&amp;\\
&amp;&amp; \text{coset leaders}&amp;&amp;
\end{matrix}.
\end{equation*}
</div>Since the received vector \({\bf y}\) is in the coseet with coset leader \({\bf e}=0010\text{,}\) the vector \({\bf y}\) is decoded to \({\bf y}-{\bf e}=1011\text{.}\)</div></div>
</div></article></section></div>
</div>
