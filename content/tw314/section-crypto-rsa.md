---
title: "The RSA system"
shell: tw314-native
sort_order: 41
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-rsa">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-rsa"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">7.2</span> <span class="title">The RSA system</span>
</h2>
<p id="p-440">First let us recap what public key encryption entails. Let \(\{ E_e : e \in \mathcal{K} \}\) be a set of encryption transformations, and let \(\{ D_d : d \in \mathcal{K} \}\)$ be the set of corresponding decryption transformations, where \(\mathcal{K}\) is the key space. Consider any pair of associated encryption/decryption transformations \((E_e , D_d)\) and suppose that each pair has the property that knowing \(E_e\) it is computationally infeasible, given a random ciphertext \(c \in \mathcal{C}\text{,}\) to find the message \(m \in \mathcal{M}\) such that \(E_e(m) = c\text{.}\) This property implies that given \(e\) (the <dfn class="terminology">public key</dfn>) it is infeasible to determine the corresponding decryption key \(d\) (the <dfn class="terminology">private key</dfn>).</p>
<figure class="figure figure-like" id="figure-crypto-rsa"><div class="image-box" style="width: 50%; margin-left: 25%; margin-right: 25%;"><img src="/tw314-assets/images/figure_public.png" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">7.2.1<span class="period">.</span></span><span class="space"> </span>A depiction of a two-party communication scheme with public key encryption. <em class="emphasis">Image source: Handbook of Cryptography</em></figcaption></figure><p id="p-441">The <dfn class="terminology">RSA cryptosystem</dfn> was invented in 1977 by Ronald Rivest, Adi Shamir, and Leonard Adleman of the <em class="emphasis">Massachusetts Institute of Technology</em> in the USA. The RSA cryptosysytem is one of the most popular public key encryption schemes in use and is based on the integer factorization problem and Fermat's Little Theorem.</p>
<p id="p-442">The <dfn class="terminology">integer factorization problem</dfn> is the following:</p>
<p id="p-443">Given a positive integer \(n\text{,}\) find its prime factorization; that is, write</p>
<div class="displaymath">
\begin{equation*}
n = p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k} = \prod_{i=1}^{k} p_i^{e_i}
\end{equation*}
</div>
<p data-braille="continuation">where the \(p_i\) are pairwise distinct primes and each \(e_i \geq 1\text{.}\)</p>
<p id="p-444"><em class="alert">RSA setup</em>:</p>
<ol id="p-445" class="decimal">
<li id="li-127">Alice generates two random primes \(p\) and \(q\text{.}\)</li>
<li id="li-128">In the ring \(\mathbf{Z}_n\) where \(n=pq\text{,}\) Alice selects integers \(e\) and \(d\) satisfying \(ed = 1 \bmod \phi(n)\text{.}\)</li>
<li id="li-129">Note that \(\phi(n)=(p-1)(q-1)\text{.}\)</li>
<li id="li-130">The public key is the pair \((e,n)\text{.}\)</li>
<li id="li-131">The private key is \(d\text{,}\) or alternatively the tuple \((d, p, q)\text{.}\)</li>
</ol>
<p id="p-446"><em class="alert">RSA encryption</em>:</p>
<p id="p-447">To encrypt a message \(0&lt; m &lt; n\) to Alice, any party computes ciphertext \(c\) as follows and sends \(c\) to Alice.</p>
<div class="displaymath">
\begin{equation*}
c = m^e \pmod n
\end{equation*}
</div>
<p id="p-448"><em class="alert">RSA decryption</em>:</p>
<p id="p-449">Alice recovers the message \(m\) from the ciphertext \(c\) using the private key as follows.</p>
<div class="displaymath">
\begin{equation*}
m=c^d\pmod n
\end{equation*}
</div>
<p id="p-450">We now show that the RSA system will always decrypt to the sent message.</p>
<article class="theorem theorem-like" id="theorem-crypto-rsa"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">7.2.2</span><span class="period">.</span>
</h6>Let \(n=pq\) for primes \(p\) and \(q\text{,}\) and let \(ed=1\pmod{\phi(n)}\text{.}\) If \(c=m^e\pmod n\text{,}\) then \(c^d=m\) for any \(m\in \mathbf{Z}_n\text{.}\)</article><article class="hiddenproof" id="proof-18"><span class="id-ref original"><h6 class="heading"><span class="type">Proof<span class="period">.</span></span></h6></span></article><div class="hidden-content tex2jax_ignore" id="hk-proof-18"><article class="hiddenproof"><p id="p-451">First note that \(c^d=m^{ed} \pmod n\text{.}\) Since \(ed=1\pmod{\phi(n)}\text{,}\) it follows that \(ed-1=i\phi(n)\) for some integer \(i\text{.}\) Therefore \(c^d=m^{i\phi(n)+1} \pmod n\text{.}\)</p>
<p id="p-452">From <span class="xref">Theorem 7.1.1</span> it follows that if \(m\) and \(p\) are relatively prime, then \(m^{p-1}=1\pmod p\) and since \(p-1\) is a factor of \(\phi(n)\)</p>
<div class="displaymath">
\begin{equation*}
m^{\phi(n)}=m^{(p-1)(q-1)}=1\pmod p.
\end{equation*}
</div>
<p data-braille="continuation">It now follows that \(m^{i\phi(n)+1} =m\pmod p\text{.}\)</p>
<p id="p-453">If \(p\) is a factor of \(m\text{,}\) then \(m=kp\) for some integer \(k\) and it follows that \(m^{i\phi(n)+1} =0=m\pmod p\text{.}\)</p>
<p id="p-454">In both cases \(m^{i\phi(n)+1} =m\pmod p\text{.}\)</p>
<p id="p-455">By repeating this arguement with \(q\) instead of \(p\text{,}\) it follows that \(m^{i\phi(n)+1} =m\pmod q\text{.}\)</p>
<p id="p-456">Since \(p\) and \(q\) are prime, it follows that \(m^{i\phi(n)+1} =m\pmod {pq}=m\pmod n\text{.}\)</p></article></div>
<article class="example example-like" id="example-crypto-rsa"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">7.2.3</span><span class="period">.</span><span class="space"> </span><span class="title">RSA encryption.</span>
</h6>Consider the RSA cryptosystem with modulus \(n=31 \cdot 43 = 1333\text{.}\) <ol class="decimal">
<li id="li-132">Take \(e \in \{854, 953 \}\text{.}\) Which value is suitable for the public encryption exponent \(e\text{?}\) Explain.</li>
<li id="li-133">Compute the private decryption exponent \(d\) using a suitable \(e\) from above.</li>
<li id="li-134">Encrypt the message \(m=38\text{.}\)</li>
<li id="li-135">Decrypt the ciphertext \(c=1002\text{.}\)</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-37"><div class="solution solution-like"><ol class="decimal">
<li id="li-136">
<p id="p-457">\(\phi(n)=30\times 42=1260\)</p>
<p id="p-458">For \(e\) to be a suitable choice it must be invertible modulo \(\phi(n)\text{,}\) that is \(GCD(e,\phi(n))=1\text{.}\)</p>
<p id="p-459">Since \(\text{GCD}(854,1260)\geq 2\) and \(\text{GCD}(953,1260)=1\text{,}\) let \(e=953\text{.}\)</p>
</li>
<li id="li-137">
<p id="p-460">Since \(ed\equiv 1\pmod{\phi(n)}\text{,}\) we make use of the extended Euclidean Algorithm to find \(d\text{.}\) Note that \(\phi(n)=30\times 42=1260\text{.}\)</p>
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r1 l0 t0 lines">\(i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(q_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(r_i\)</td>
<td class="c m b1 r1 l0 t0 lines">\(x_i\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(y_i\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(1260\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(0\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines"></td>
<td class="c m b0 r1 l0 t0 lines">\(953\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(307\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-1\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(3\)</td>
<td class="c m b0 r1 l0 t0 lines">\(32\)</td>
<td class="c m b0 r1 l0 t0 lines">\(-3\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(4\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(4\)</td>
<td class="c m b0 r1 l0 t0 lines">\(9\)</td>
<td class="c m b0 r1 l0 t0 lines">\(19\)</td>
<td class="c m b0 r1 l0 t0 lines">\(28\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-37\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(5\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(13\)</td>
<td class="c m b0 r1 l0 t0 lines">\(-31\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(41\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(6\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(6\)</td>
<td class="c m b0 r1 l0 t0 lines">\(59\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-78\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(7\)</td>
<td class="c m b0 r1 l0 t0 lines">\(2\)</td>
<td class="c m b0 r1 l0 t0 lines">\(1\)</td>
<td class="c m b0 r1 l0 t0 lines">\(-149\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(197\)</td>
</tr>
<tr>
<td class="c m b0 r1 l0 t0 lines">\(8\)</td>
<td class="c m b0 r1 l0 t0 lines">\(6\)</td>
<td class="c m b0 r1 l0 t0 lines">\(0\)</td>
<td class="c m b0 r1 l0 t0 lines">\(953\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(-1260\)</td>
</tr>
</table></div></div></div>
<p id="p-461">Hence \(d=197\text{.}\)</p>
</li>
<li id="li-138">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">\(e \)</td>
<td class="c m b1 r0 l0 t0 lines">\(b\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(r\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(953\)</td>
<td class="c m b0 r0 l0 t0 lines">\(38\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(476\)</td>
<td class="c m b0 r0 l0 t0 lines">\(111\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(38\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(238\)</td>
<td class="c m b0 r0 l0 t0 lines">\(324\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(38\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(119\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1002\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(38\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(59\)</td>
<td class="c m b0 r0 l0 t0 lines">\(255\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(752\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(29\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1041\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1141\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(14\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1285\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(78\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(7\)</td>
<td class="c m b0 r0 l0 t0 lines">\(971\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(78\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(3\)</td>
<td class="c m b0 r0 l0 t0 lines">\(410\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1090\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines">\(142\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(345\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines">\(169\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1002\)</td>
</tr>
</table></div></div></div>
<p id="p-462">Hence \(c=38^{953}=1002 \pmod{1333}\text{.}\)</p>
</li>
<li id="li-139">
<div class="sidebyside"><div class="sbsrow" style="margin-left:0%;margin-right:0%;"><div class="sbspanel fixed-width" style="width:100%;justify-content:flex-start;"><table>
<tr>
<td class="c m b1 r0 l0 t0 lines">\(e \)</td>
<td class="c m b1 r0 l0 t0 lines">\(b\)</td>
<td class="c m b1 r0 l0 t0 lines" data-braille="last-cell">\(r\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(197\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1002\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(98\)</td>
<td class="c m b0 r0 l0 t0 lines">\(255\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1002\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(49\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1041\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(1002\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(24\)</td>
<td class="c m b0 r0 l0 t0 lines">\(1285\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(676\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(12\)</td>
<td class="c m b0 r0 l0 t0 lines">\(971\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(676\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(6\)</td>
<td class="c m b0 r0 l0 t0 lines">\(410\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(676\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(3\)</td>
<td class="c m b0 r0 l0 t0 lines">\(142\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(676\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(1\)</td>
<td class="c m b0 r0 l0 t0 lines">\(169\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(16\)</td>
</tr>
<tr>
<td class="c m b0 r0 l0 t0 lines">\(0\)</td>
<td class="c m b0 r0 l0 t0 lines">\(568\)</td>
<td class="c m b0 r0 l0 t0 lines" data-braille="last-cell">\(38\)</td>
</tr>
</table></div></div></div>
<p id="p-463">Hence \(m=1002^{197}=38 \pmod{1333}\text{.}\)</p>
</li>
</ol></div></div>
</div></article></section></div>
</div>
