class NavContent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<div class="w-full flex justify-between  py-6 px-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] sticky top-0 z-10 bg-white">
    <div class=" flex ">
        <h1 class=" text-2xl oswald-800 ">
        <a href="index.html">  Fit3D</a> </h1>
    </div>
    <div class=" flex gap-8 poppins-semibold "><a href=" " class=" px-3 py-1 ">Help</a><a href=" "
            class=" border-2 border-black px-3 py-1 rounded ">Contact</a></div>
</div> `;
  }
}

customElements.define("nav-bar", NavContent);
