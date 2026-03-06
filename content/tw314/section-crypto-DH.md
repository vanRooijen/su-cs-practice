---
title: "Diffie-Hellman"
shell: tw314-native
sort_order: 36
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-DH">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-DH"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">6.2</span> <span class="title">Diffie-Hellman</span>
</h2>
<p id="p-370">Alice and Bob want to share a secret key for use in a symmetric cipher, but their only means of communication is insecure. If every piece of information that they exchange is observed by their adversary Eve, how can they exchange a secret key?</p>
<p id="p-371">The <dfn class="terminology">Diffie-Hellman key exchange</dfn> (DH) was invented in 1976 and is a widely-deployed scheme used to compute a secret session key by exchanging public values.</p>
<p id="p-372"><em class="alert">Setup</em>:</p>
<p id="p-373">A large prime \(p\) and a generator \(g\) of \(\mathbf{F}^*_p\) is fixed and made public. That is \(\langle g\rangle=\mathbf{F}_p^*\text{.}\)</p>
<p id="p-374"><em class="alert">Operation</em>:</p>
<ol class="decimal">
<li id="li-89">Alice randomly selects \(1\leq a&lt;\text{ord}(g)\) and send \(A=g^a \pmod p\) to Bob.</li>
<li id="li-90">Bob randomly selects \(1\leq b&lt;\text{ord}(g)\) and send \(B=g^b \pmod p\) to Alice.</li>
<li id="li-91">Alice computes \(B^a \pmod p\text{.}\)</li>
<li id="li-92">Bob computes \(A^b \pmod p\text{.}\)</li>
</ol>
<p id="p-375">The session key is \(S=B^a=(g^b)^a=(g^a)^b=A^b \pmod p\text{.}\)</p>
<article class="example example-like" id="example-crypto-DH"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.2.1</span><span class="period">.</span><span class="space"> </span><span class="title">Diffie-Hellman.</span>
</h6>Consider a Diffie-Hellman key exchange in the group \(\mathbf{F}_{53}^*\) with generator \(g=2\text{.}\) If Alice's secret exponent is \(a = 19\) and Bob's secret exponent is \(b=17\text{,}\) compute the messages that Alice and Bob sends to each other as well as the shared secret session key.<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-29"><div class="solution solution-like">
<p id="p-376">Alice sends the message \(A=g^a=2^{19}\equiv 12\pmod{53}\text{.}\)</p>
<p id="p-377">Bob sends the message \(B=g^b=2^{17}\equiv 3\pmod{53}\text{.}\)</p>
<p id="p-378">The shared secret session key can be determined in three ways:</p>
<div class="displaymath">
\begin{equation*}
S=g^{ab}=2^{17\times 19}=2^{323}=2^{6\times 52+11}=2^{11}\equiv 34 \pmod{53}.
\end{equation*}
</div>
<p id="p-379">OR</p>
<div class="displaymath">
\begin{equation*}
S=A^b=12^{17}\equiv 34 \pmod{53}.
\end{equation*}
</div>
<p id="p-380">OR</p>
<div class="displaymath">
\begin{equation*}
S=B^a=3^{19}\equiv 34 \pmod{53}.
\end{equation*}
</div>
</div></div>
</div></article><p id="p-381">To calculate the session key, an attacker needs to recover one of:</p>
<ol class="decimal">
<li id="li-93">\(a\) given \(A\) or \(b\) given \(B\text{.}\)</li>
<li id="li-94">\(g^{ab}\) given \(A\) and \(B\text{.}\)</li>
</ol>
<p id="p-382">DH can be used in any group where exponentiation is efficient and the discrete logarithm problem is hard.</p>
<article class="example example-like" id="example-crypto-DH2"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">6.2.2</span><span class="period">.</span><span class="space"> </span><span class="title">Diffie-Hellman secret.</span>
</h6>Consider a Diffie-Hellman key exchange in the group \(\mathbf{F}_{53}^*\) with generator \(g=2\text{.}\) If Alice sends Bob the message \(A=15\text{,}\) what is her secret exponent?<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-30"><div class="solution solution-like">
<p id="p-383">To find Alice's secret exponent we have to find \(a\) such that \(g^a=A\text{,}\) that is \(2^a=15 \pmod{53}\text{.}\)</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">\(i\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(2^i\pmod{53}\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(2\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(2\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(4\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(3\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(8\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(4\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(16\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(5\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(32\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(6\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(11\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(7\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(22\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(8\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(44\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(9\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(35\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(10\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(17\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(11\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(34\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(12\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(15\)</td>
</tr>
</table></div></div></div>
<p id="p-384">Hence Alice's secret exponent is \(a=12\text{.}\)</p>
</div></div>
</div></article><p id="p-385"><em class="alert">Attack strategies</em>: Man-in-the-middle attacks</p>
<p id="p-386">Alice wants to agree on a key with Bob.</p>
<ol class="decimal">
<li id="li-95">Alice sends \(A=g^a\text{.}\)</li>
<li id="li-96">Mallory intercepts it and sends \(X=g^x\) to Bob.</li>
<li id="li-97">Bob sends \(B=g^b\text{.}\)</li>
<li id="li-98">Mallory intercepts it and sends \(Y=g^y\) to Alice.</li>
</ol>
<p id="p-387">Alice and Bob don't share a key with each other but with a man-in-the-middle Mallory.</p></section></div>
</div>
