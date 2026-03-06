---
title: "Fields"
shell: tw314-native
sort_order: 33
---

<div class="tw314-native-document" data-tw314-slug="section-crypto-field">
<div id="content" class="pretext-content"><section class="section" id="section-crypto-field"><h2 class="heading hide-type">
<span class="type">Section</span> <span class="codenumber">5.4</span> <span class="title">Fields</span>
</h2>
<p id="p-344">A <dfn class="terminology">field</dfn> \((\mathcal{K},+,\times)\) satisfies</p>
<ol class="decimal">
<li id="li-81">\((\mathcal{K},+,\times)\) is a ring with identities 0 and 1.</li>
<li id="li-82">\((\mathcal{K}\setminus\{0\},\times)\) is a commutative group.</li>
</ol>
<p id="p-345"><dfn class="terminology">Finite fields</dfn> or <dfn class="terminology">Galois fields</dfn> are fields with a finite number of elements, denoted by \(\mathbf{F}\) or \(GF\text{.}\)</p>
<article class="theorem theorem-like" id="theorem-crypto-primefield"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">5.4.1</span><span class="period">.</span>
</h6>\((\mathbf{Z}_m,+,\times)\) is a field if and only if \(m\) is a prime number.</article><p id="p-346">A polynomial \(f(x)\in \mathbf{F}[x]\) is <dfn class="terminology">reducible</dfn> if \(f(x)=a(x)b(x)\) for non-constant polynomials \(a(x),b(x)\in \mathbf{F}[x]\text{.}\) If \(f(x)\) is not reducible, it is <dfn class="terminology">irreducible</dfn>.</p>
<article class="theorem theorem-like" id="theorem-crypto-functionfield"><h6 class="heading">
<span class="type">Theorem</span><span class="space"> </span><span class="codenumber">5.4.2</span><span class="period">.</span>
</h6>The ring \(\mathbf{F}[x]/f(x)\) is a field if and only if \(f(x)\) is irreducible in \(\mathbf{F}[x]\text{.}\)</article><article class="example example-like" id="example-crypto-irreducible"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.4.3</span><span class="period">.</span><span class="space"> </span><span class="title">Irreducibility.</span>
</h6>Determine whether the following polynomials are irreducible. <ol class="decimal">
<li id="li-83">\(f(x)=x^3+x^2+1\) in \(\mathbf{F}_2[x]\)</li>
<li id="li-84">\(f(x)=x^3+x^2+1\) in \(\mathbf{F}_3[x]\)</li>
<li id="li-85">\(f(x)=x^4+x^2+1\) in \(\mathbf{F}_2[x]\)</li>
</ol>
<div class="solutions">
<span class="id-ref original"><span class="type">Solution</span></span><div class="hidden-content tex2jax_ignore" id="hk-solution-26"><div class="solution solution-like"><ol class="decimal">
<li id="li-86">Since \(f(1)=1^3+1^2+1=1\text{,}\) therefore \((x+1)\) is not a factor of \(f(x)\text{.}\) Since \(f\) is of degree 3, it also has no factor on degree 2 and therefore \(f(x)\) is irreducible in \(\mathbf{F}_2[x]\text{.}\)</li>
<li id="li-87">Since \(f(1)=1^3+1^2+1=0\pmod 3\text{,}\) \((x-1)\) is a factor of \(f(x)\) and hence \(f\) is reducible in \(\mathbf{F}_3[x]\text{.}\)</li>
<li id="li-88">Since \(f(1)=1^4+1^2+1=1\text{,}\) therefore \((x+1)\) is not a factor of \(f(x)\text{.}\) Since \(f\) is of degree 4, it also has no factor on degree 3. Since \((x+1)\) is a factor of \(x^2+1\text{,}\) the only degree 2 polynomial that may be a facor of \(f(x)\) is \(x^2+x+1\text{.}\) Since \((x^2+x+1)\times (x^2+x+1)=x^4+x^2+1\) \(f(x)\) is reducible in \(\mathbf{F}_2[x]\text{.}\)</li>
</ol></div></div>
</div></article><p id="p-347">If \(\mathbf{F}\) is a finite field, then \(\mathbf{F}\) contains \(p^m\) elements for some prime \(p\) and integer \(m\geq 1\text{.}\)</p>
<p id="p-348">For every prime power \(p^m\text{,}\) there is a unique (up to an isomorphism) finite field of order \(p^m\) denoted by \(\mathbf{F}_{p^m}\text{.}\)</p>
<p id="p-349">The field \(\mathbf{F}_{p^m}\) is called an extension field since it contains a copy of \(\mathbf{Z}_p\) as a subfield.</p>
<p id="p-350">The non-zero elements of \(\mathbf{F}_q\text{,}\) for \(q=p^m\text{,}\) is called the multiplicative group of \(\mathbf{F}_q\) denoted by \(\mathbf{F}_q^*\text{.}\)</p>
<article class="example example-like" id="example-crypto-field"><h6 class="heading">
<span class="type">Example</span><span class="space"> </span><span class="codenumber">5.4.4</span><span class="period">.</span><span class="space"> </span><span class="title">Finite fields.</span>
</h6>The polynomial \(f(x)=x^3+x+1\in \mathbf{F}_2[x]\) is irreducible over \(\mathbf{F}_2\text{.}\) Then \(\mathbf{F}_2[x]/f(x)=\mathbf{F}_{2^3}\text{.}\)</article></section></div>
</div>
