---
title: "What is cryptography?"
shell: tw314-native
sort_order: 26
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-notation">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-notation"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">4.1</span> <span class="title">What is cryptography?</span>
</h2>
<p id="p-259">Cryptography is the study of mathematical ideas related to aspects of information security such as confidentiality, data integrity, entity authentication, and data origin authentication.</p>
<p id="p-260">We can see these aspects as cryptographic goals that we want to achieve with a cryptographic system, both in theory and practice.</p>
<p id="p-261"><dfn class="terminology">Confidentiality</dfn> is a service that ensures that only those with authorization have access to the information.</p>
<p id="p-262"><dfn class="terminology">Data integrity</dfn> is a service that ensures that the information is not altered by an unauthorized enitity.</p>
<p id="p-263"><dfn class="terminology">Entity authentication</dfn> is a service that ensures that an entity is who it claims to be.</p>
<p id="p-264"><dfn class="terminology">Data origin authentication</dfn> is a service that ensures that an entity claiming to have sent the message is in fact the original sender.</p>
<p id="p-265"><dfn class="terminology">Non-repudiation</dfn> is a service that prevents an entity from denying previous commetments or actions.</p>
<p id="p-266">In this course we only consider public-key systems, in <span class="xref">Figure 4.1.1</span> it shows where it fits into the cryptography setting.</p>
<figure class="figure figure-like" id="figure-crypto-primitives"><div class="image-box" style="width: 70%; margin-left: 15%; margin-right: 15%;"><img src="/tw314-assets/images/figure_taxonomy.png" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">4.1.1<span class="period">.</span></span><span class="space"> </span>A taxonomy of cryptographic primitives. <em class="emphasis">Image source: Handbook of Cryptography</em></figcaption></figure><p id="p-267">First we define some basic terminology and notation.</p>
<p id="p-268">The <dfn class="terminology">alphabet of definition</dfn>, denoted by \(\mathcal{A}\text{,}\) is a finite set of elements. For example, \(\mathcal{A}=\{0,1\}\) is the binary alphabet.</p>
<p id="p-269">The <dfn class="terminology">message space</dfn>, denoted by \(\mathcal{M}\text{,}\) is a set containing strings of symbols from an alphabet of definition. An element of \(\mathcal{M}\) is called a <dfn class="terminology">plaintext</dfn>.</p>
<p id="p-270">The <dfn class="terminology">ciphertext space</dfn>, denoted by \(\mathcal{C}\text{,}\) is a set containing strings of symbols from an alphabet of definition. This alphabet of definition may differ from the aplhabet of definition for \(\mathcal{M}\text{,}\) An element of \(\mathcal{C}\) is called a <dfn class="terminology">ciphertext</dfn>.</p>
<p id="p-271">The <dfn class="terminology">key space</dfn>, denoted by \(\mathcal{K}\text{,}\) is a set of elements where each element is called a <dfn class="terminology">key</dfn>.</p>
<p id="p-272">The <dfn class="terminology">encryption function</dfn> \(E_e\) for \(e\in \mathcal{K}\) is a bijection from \(\mathcal{M}\) to \(\mathcal{C}\text{.}\) That is \(E_e: \mathcal{M}\mapsto \mathcal{C}\text{.}\)</p>
<p id="p-273">The <dfn class="terminology">decryption function</dfn> \(D_d\) for \(d\in \mathcal{K}\) is a bijection from \(\mathcal{C}\) to \(\mathcal{M}\text{.}\) That is \(D_d: \mathcal{C}\mapsto \mathcal{M}\text{.}\)</p>
<p id="p-274">A <dfn class="terminology">cipher</dfn> consists of a set of encryption functions \(\{E_e\colon e\in \mathcal{K}\}\) and a corresponding set of decryption functions \(\{D_d\colon d\in \mathcal{K}\}\) such that for each \(e\in \mathcal{K}\) there exist an unique \(d\in \mathcal{K}\) that \(D_d=E_e^{-1}\text{,}\) that is, \(D_d(E_e(m))=m\) for all \(m\in \mathcal{M}\text{.}\)</p>
<figure class="figure figure-like" id="figure-crypto-cipher"><div class="image-box" style="width: 70%; margin-left: 15%; margin-right: 15%;"><img src="/tw314-assets/images/figure_twopartyencryption.png" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">4.1.2<span class="period">.</span></span><span class="space"> </span>A two-party cipher over an unsecured channel. <em class="emphasis">Image source: Handbook of Cryptography</em></figcaption></figure><article class="example example-like" id="example-crypto-cipher"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">4.1.3</span><span class="period">.</span><span class="space"> </span><span class="title">Example of a cipher.</span>
</h6>
<p id="p-275">Let \(\mathcal{A} = \{A,B,\dots,Z\}\) be the English alphabet. Let \(\mathcal{M}\) and \(\mathcal{C}\) be the set of all strings of length five over \(\mathcal{A}\text{.}\) The key \(e\in\mathcal{K}\) is chosen to be a permutation on \(\mathcal{A}\text{.}\) To encrypt, an English message is broken up into groups each having five letters and to encrypt each letter of the alphabet is mapped to the letter \(e\) spaces to its right. To decrypt, the inverse shift \(d = e^{-1}\) is applied to each letter of the ciphertext. For instance, suppose that the key \(e=3\) is chosen.</p>
<p id="p-276">Encrypt the message</p>
<div class="displaymath">
\begin{equation*}
m=THISI\ SNOTS\ ECURE\text{.}
\end{equation*}
</div>
<p id="p-277">Now determine the decryption key and decrypt the message</p>
<div class="displaymath">
\begin{equation*}
c=QHLWK\ HULVW\ KLVPH\ VVDJH\text{.}
\end{equation*}
</div>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-16"><div class="solution solution-like">
<div class="displaymath">
\begin{equation*}
E_e(m)=WKLVL\ VQRWV\ HFXUH
\end{equation*}
</div>
<p id="p-278">For decryption, each letter will be mapped to the letter \(e\) spaces to its left, hence \(d=-3\text{.}\)</p>
<div class="displaymath">
\begin{equation*}
D_d(c)=NEITH\ ERIST\ HISME\ SSAGE
\end{equation*}
</div>
</div></div>
</div></article><p id="p-279">Can you think of a cipher where the alphabet of definition for the message and the cipher space differ?</p></section></div>
</div>
