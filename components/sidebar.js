class Content extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="w-60  shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] fixed"
    style="height: calc(100vh - 83px);">
    <div class="flex flex-col ">
        <a class="flex gap-3 items-center hover:bg-neutral-200 py-3 border-b px-4 mt-10" href="./model_view.html"><img class="w-6"
                src="../assets/home.png" alt="" srcset=""><span class=" ">Home</span></a>
        <a class="flex gap-3 items-center hover:bg-neutral-200 py-3 border-b px-4" href="./slicing.html"><img class="w-6"
                src="../assets/scissors.png" alt="" srcset=""><span class=" ">Slicing</span></a>
        <a class="flex gap-3 items-center hover:bg-neutral-200 py-3 border-b px-4" href="./calculate.html"><img class="w-6"
                src="../assets/choice.png" alt="" srcset=""><span class=" ">Sections</span></a>
        <a class="flex gap-3 items-center hover:bg-neutral-200 py-3 border-b px-4" href="./calculate.html"><img class="w-6"
                src="../assets/keys.png" alt="" srcset=""><span class=" ">Calculate</span></a>
        <a class="flex gap-3 items-center hover:bg-neutral-200 py-3 border-b px-4" href="./fit_report.html"><img class="w-6"
                src="../assets/report.png" alt="" srcset=""><span class=" ">Fit Report</span></a>
        <a class="flex gap-3 items-center hover:bg-neutral-200 py-3 border-b px-4" href=""><img class="w-6"
                src="../assets/info.png" alt="" srcset=""><span class=" ">Info</span></a>
    </div>

</div>
      `;
  }
}

customElements.define("side-bar", Content);
