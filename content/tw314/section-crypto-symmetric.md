---
title: "Symmetric-key primitives"
shell: tw314-native
sort_order: 27
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-symmetric">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-symmetric"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">4.2</span> <span class="title">Symmetric-key primitives</span>
</h2>
<p id="p-280">Consider a cryptographic scheme consisting of the sets of encryption and decryption transformations \(E_e\) and \(D_d\) with \(e,d\in \mathcal{K}\text{,}\) respectively.</p>
<p id="p-281">The encryption scheme is symmetric-key if either the same key is used for encryption and decryption or there is a simple transformation to determine \(d\) knowing only \(e\text{,}\) and to determine \(e\) from \(d\text{.}\)</p>
<figure class="figure figure-like" id="figure-crypto-symmetric"><div class="image-box" style="width: 70%; margin-left: 15%; margin-right: 15%;"><img src="/tw314-assets/images/figure_symmetric.png" style="width: 100%; height: auto;" alt=""></div>
<figcaption><span class="type">Figure</span><span class="space"> </span><span class="codenumber">4.2.1<span class="period">.</span></span><span class="space"> </span>A depiction of a symmetric-key cryptographic scheme. <em class="emphasis">Image source: Handbook of Cryptography</em></figcaption></figure><p id="p-282">A <dfn class="terminology">block cipher</dfn> is an encryption scheme which breaks up the plaintext messages to be transmitted into strings (called blocks) of a fixed length \(t\) over an alphabet \(\mathcal{A}\text{,}\) and encrypts one block at a time.</p>
<p id="p-283"><dfn class="terminology">Stream ciphers</dfn> are, in one sense, very simple block ciphers having block length equal to one.</p></section></div>
</div>
