<template>
  <Modal
    v-model="modalVisible"
    @on-visible-change="onVisibleChange"
    class-name="vertical-center-modal"
    :width="width"
    :closable="false"
    :mask-closable="true"
    footer-hide
  >
    <div slot="header" class="alert-modal-header alert-agreement-modal-header">
      <button @click="onClose" type="button" class="close">×</button>
    </div>
    <div class="alert-modal-body alert-agreement-modal-body">
      <h2 class="agreement-heading">{{siteName}}小书平台写作线上协议</h2>
      <div class="agreement-content">
        本协议系由{{companyName}}（以下简称“平台”）与所有通过{{siteName}}小书平台发布作品的主体（以下简称“作者”）就资源的引入、使用及相关服务所订立的有效合约，所有作者必须同意并遵守本协议。作者通过作者发布程序阅读本协议并点击"同意"按钮或以任何方式参与数字作品提交均被视为作者完全接受本协议。
        一、总则
        1.1 本协议内容包括点点小书与作者（线上）协议及所有平台已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。
        1.2 双方承诺接受并遵守本协议的约定。本协议一经勾选“我已阅读并同意”后生效，平台有权随时对协议内容进行修订，修订后的协议将公布于点点小书平台上，作者继续使用点点小书，则视为对修订后的协议不持任何异议并同意遵守；如作者对协议存在异议，可以向平台书面提出退出点点小书，但作者在平台确认其退出许可前的行为，仍受本协议约束。
        二、定义
        2.1 “点点小书平台”（以下简称“点点小书”）：是指由平台所有并运营的数字作品引入平台及各类客户端软件，供点点小书的作者和用户发布或查询、使用数字作品。
        2.2 “数字作品”： 指作者通过点点小书向用户提供的电子图书、文字作品、交流活动文字整理、图片、电子杂志，电子报纸、音频、视频等各类数字化作品，以及与数字作品相关的内容。就文字作品而言，包括标题、正文、附注等内容。
        2.3 “用户”：是指在点点小书浏览、阅读、下载等使用数字作品的互联网用户和移动互联网用户。
        2.4 “注册”：是指作者登录点点小书，按要求填写相关信息，在线申请其服务账户的过程。注册的作者必须是拥有合法的数字作品的实体，如作者违反本协议有关作者的规定或超越其民事权利能力或民事行为能力范围的，则本协议自始无效，一经发现，平台有权立即注销其服务账户，并追究其违约使用点点小书服务的法律责任。
        三、平台模式
        3.1 平台向作者提供点点小书及相关服务，使作者得以通过点点小书发布数字作品及相关信息并接受用户对数字作品的浏览、阅读、下载或其他使用需求。
        3.2 自本协议生效后，作者免费授权平台在点点小书上免费使用作者提供的数字作品，包括但不限于将作者数字作品在点点小书上进行上传、复制、传输、通过信息网络传播、推广，供用户以搜索、浏览、阅读或者下载等方式使用；并授权平台将作者数字作品基于互联网或无线互联网形式面向全球用户进行推广。
        3.3 作者在未得到平台许可的情况下，不得授权第三方以任何形式传播作者在点点小书上发布的数字作品。本规定在数字作品发布之日起一年后自动失效。
        四、所有权与知识产权
        平台保留对以下各项内容、信息完全的、不可分割的所有权及知识产权:
        （1）点点小书及其所有组成元素，包括但不限于所有内容、数据、技术、软件、代码、用户界面以及与其相关的任何衍生作品；
        （2）作者向点点小书提供的与该平台服务相关的任何信息及反馈（不包含作者向点点小书提供的数字作品）。
        五、作者的权利与义务
        5.1 作者保证拥有所提供数字作品的完整版权与有效授权，有权授权平台在点点小书上以本协议约定的方式使用授权作品。
        （1）对于非作者自有权利的数字作品，作者应当获得权利人的有效授权，确保作者有权通过点点小书上传、复制、传输、通过信息网络传播、推广该等数字作品。作者确保其获得的授权可以使平台合法地通过点点小书推广和按约使用数字作品。作者应自行向权利人支付可能存在的许可费用、版税以及其它应缴费用以获取权利人的有效授权。
        （2）对于作者自有权利的数字作品，作者签署本协议即代表作者免费授权平台通过点点小书推广和按约使用数字作品，包括但不限于将数字作品存储于点点小书提供的存储空间和通过点点小书进行信息网络传播等。
        5.2 作者保证其所提供的全部作品（包括作品封面、图片、目录、正文内容、视频等）及在点点小书上传的全部信息符合中国法律、法规及国家政策的规定，不含任何违法、违规内容。
        5.3 作者免费授予平台拥有全部授权作品及相关信息的信息网络传播权。根据上述授权，平台有权将作者授权使用的数字作品基于互联网或无线互联网在点点小书及平台其它产品上进行传播或推广。
        5.4 作者保证本协议的签署和履行并不侵犯任何第三方权益，也不会被任何第三方追索；作者保证提供的数字作品不存在任何权利瑕疵，没有侵犯任何第三方的合法权益；作者对所提供数字作品资源内容的真实性、准确性、完整性、合法性等负完全责任；如平台被第三方主张权利而产生任何纠纷、仲裁、诉讼，或遭到国家相关部门处理，由作者出面解决，承担全部法律责任并使平台免责，并赔偿因上述原因给平台造成的全部直接和间接损失。
        5.5 作者应妥善保管自己的服务账户及密码信息，因作者自身原因丢失账户、密码或其他重要信息等，作者自行承担一切不利后果。严禁作者以任何形式擅自转让或授权他人使用自己的服务账户，一经发现，平台有权立即封禁该服务账户，并有权终止向作者提供本协议约定的服务而无须承担违约责任。
        5.6 作者承诺并完全同意：作者对其数字作品的上传、存储、传播等环节产生的后果独立承担全部法律责任。
        5.7 未经平台事先许可，作者不得在数字作品发布之日起一年内授予第三方传播其数字作品的权利。
        5.8 未经平台事先书面同意，作者不得使用平台的名义进行任何以营利为目的的商业活动或任何可能对平台的品牌造成不利影响的活动。
        5.9 未经平台事先书面许可，作者不得擅自删除、下线、中断或关闭其已向点点小书提供的授权数字作品。
        5.10 如因作者提供给的数字作品的版权到期或作者权利授权方原因等导致该数字作品需要下线的，作者应提前30天以书面形式通知平台后，方可对相应数字作品进行下线处理。
        六、点点小书的权利与义务
        6.1 平台负责对作者授权作品及相关信息在点点小书及其它展示终端上的运营业务提供相关的技术支持与维护服务。
        6.2 平台可以根据国家法律法规及相关政策的规定，制定平台及点点小书各项管理制度，对作者授权数字作品在点点小书的上传、存储、通过信息网络传播、使用等行为进行规范；同时，对于违反国家法律、法规、规范性文件规定及其他不符合平台或点点小书要求的数字作品，平台有权禁止该作品在点点小书或其它平台产品上进行发布或展示。
        6.3 出于为用户提供更好阅读体验以及使作者作品在点点小书上得到更好展示的目的，平台有权对作者授权在点点小书上展示的数字作品的格式进行加工和制作及销售数字作品的权利。
        6.4 出于宣传或推广的目的，平台有权在授权范围内免费使用作者数字作品的片段（不超过原作品内容的30%）、作品名称、作品插图等，并授权平台及其关联公司对作者数字作品进行全文内容检索。同时，平台可为履行本协议目的，在点点小书和其他媒介使用作者的商标、标识等知识产权，以说明作者参与本协议项下的情况。
        6.5 对于第三方侵犯本协议项下数字作品的侵权行为，作者授权平台有权独立采取包括但不限于诉讼、仲裁等各种法律手段维护自身的合法权益并获取相应收益，维权行为所发生的费用由平台独自承担。
        6.6 由于作者与第三方就数字作品版权出现争议导致阅读开放平台必须对该作品下线的，平台可予以配合，但作者应承担由此产生的全部责任以及给平台造成的全部损失。
        6.7 如作者数字作品或相关业务违反本协议约定，或造成点点小书系统严重负担，或不符合平台或点点小书相关制度规则，或其他有损平台或点点小书利益的，平台有权不予上线或通知作者移除相关内容，作者应在接到通知后立刻移除，平台也可以不经通知自行移除数字作品，无需承担任何违约责任。
        6.8 本协议到期后，如作者并未主动下线或删除点点小书上的数字作品，视为作者授权平台在平台上继续按本协议约定的方式使用其数字作品，授权期限直至作者主动删除或下线数字作品为止。
        七、隐私
        7.1 在收集、使用、共享或存储与任何用户相关的所有数据（包括但不限于任何用户信息）时，作者同意实施并遵守所适用的隐私和保密标准，这些标准至少与平台隐私政策中阐明的标准同等严格和对用户有利。
        7.2 为保护用户的隐私，并使用户能够控制对其数据隐私设置的访问，禁止作者将其访问或收集的与点点小书用户相关的任何数据提供给任何第三方。作者据此同意遵守并且不以任何方式避开由平台设定的所有此类数据访问限制和用户选择的任何隐私设置。
        7.3 在平台提出要求时，作者应立即向平台提供相关用户信息，以便:
        (1)保护或维护平台或点点小书或其员工、代理商等的合法权利或财产；
        (2)保护点点小书服务的用户或公众的安全（包括在紧急情况下采取相应措施）；
        (3)防止欺诈行为或实现风险管理目的；
        (4)执行相关政府主管部门的要求、规定、命令等；
        (5)遵守法律或法定程序。
        八、信息披露与保密
        8.1 作者与平台关于重大信息的披露、采用、表述等均应获得双方的一致认可。作者可以宣传其已与点点小书的事实与情况，但未经过平台事先书面同意，不得发布使用任何含有平台名称、商标、logo、标记等的新闻稿、其他宣传声明或推广材料。出于宣传或推广目的，平台有权发布、提及或描述点点小书、点点小书授权数字作品或作者的宣传和推广材料。
        8.2 平台或作者对于因签署或履行本协议而了解或接触到的对方的商业秘密及其他保密资料和信息（以下简称“保密信息”）均应保守秘密。除非国家法律法规、政府或者法院的要求，或者本协议双方同意，任何一方不得向任何第三方泄露、给予或转让该等保密信息。
        除为实现本协议项下约定之目的所必须外，未经对方事先书面同意，任何一方不得擅自使用、复制或擅自向任何第三方授权使用、授权复制对方的商标、标志、商业信息、技术及其他资料等。
        8.3 本保密条款不因本协议的无效、被撤销、解除、提前终止、不具操作性等而失效。
        九、免责声明
        9.1 本协议项下点点小书将在现有技术的基础上尽最大努力提供相应的安全措施以保障服务安全和正常运行。但点点小书明确声明对服务不作任何明示或暗示的保证，包括但不限于对服务的安全性、可靠性、持续性、准确性、适用于某一特定用途等。作者签署本协议即意味着理解且不要求平台或点点小书在以下任一情况下承担责任：
        （1）不可抗力。不可抗力是指本协议双方不能合理控制、不可预见或即使预见亦无法避免的事件，包括但不限于政府行为、地震、台风、洪水、火灾或其它天灾、战争或任何其它类似事件。
        （2）鉴于互联网之特殊性质，不可抗力亦包括但不限于下列影响互联网正常运行之情形：
        （a）黑客攻击；
        （b）电信部门技术调整导致之重大影响；
        （c）因政府管制而造成之暂时关闭；
        （d）病毒侵袭；
        （e）网站升级、系统停机维护或通讯终端、电信设备出现故障导致无法进行数据传输；
        （f）其他非因双方原因导致互联网无法正常运行、服务中断或延迟之情形。
        （3）如发生不可抗力事件，遭受该事件的一方应立即以可能的最快捷的方式通知另一方该事件的性质、发生日期、预计持续时间等有关细节，以及该事件阻碍通知方履行其于本协议项下义务的程度。
        （4）在不可抗力事件持续期间，遭受不可抗力事件的一方应定期及时地告知另一方不可抗力事件的现状。如不可抗力事件结束，应立即以书面形式通知对方，并继续履行其于本协议项下之义务。
        （5）遭受不可抗力事件的一方应当向另一方提供事件发生地区的公证机构(或其他适当机构)出具的证实不可抗力事件的合法证明。
        （6）如果不可抗力事件持续超过九十（90）天，任何一方均可按本协议11.1之规定终止本协议。
        （7）本协议任何一方违约后遭遇不可抗力的，违约责任不因不可抗力而免除。
        9.2 平台有权在提前通知或不通知的情况下随时修改、限制、暂停或终止全部或部分点点小书服务，对于此等修改、限制、暂停或终止行为，平台对作者或任何第三方不负任何责任。
        9.3 平台及其关联公司仅向作者及用户提供技术平台以便作者得以向通过信息网络传播、推广其授权数字作品，不对作者或用户的任何口头、书面陈述或者其向点点小书上传的任何信息之真实性、合法性做任何担保，或对此承担任何责任。平台与点点小书不对作者与用户之间达成的或涉及的法定义务或约定义务承担任何责任。平台与点点小书亦无义务参与与数字作品使用有关的任何理赔、纠纷处理等活动。如因数字作品或其使用产生纠纷的，作者应以自己的名义独立承担所有法律责任。
        9.4 平台没有义务为作者保存其存储于点点小书中的数据以及作者使用点点小书产生的任何数据。作者应自行对相关数据进行定期保存。作者如因数据丢失造成损失或产生其他责任，平台及点点小书均不负责承担。
        9.5 在任何情况下，平台、点点小书及其董事、员工或代理人，均不负责对作者或任何第三方就任何法定或约定之损害承担责任，即使平台或点点小书已经知道或已被告知发生了上述损害或上述损害发生的可能性。
        十、违约责任
        10.1 除本合同另有约定外，任何一方违反本合同约定的，应赔偿因此给另一方造成的经济损失。
        10.2 因作者所提供的数字作品存在权利瑕疵或侵犯任何第三方的合法权益、内容违法违规等导致平台或点点小书损失或陷入诉讼、争议，或者受到国家有关部门的查处或处罚，应视为作者根本违约，由作者出面解决并承担全部责任。同时，平台有权单方解除本协议，终止提供本协议约定的服务。因此给平台造成损失的，作者应负责赔偿平台的全部损失，包括直接损失与其他合理损失。
        10.3 若双方均违反本协议之约定，则应当各自承担相应的责任。
        十一、协议期限与终止
        11.1 协议终止：发生以下任何事件时，经书面通知对方，任何一方均可立即终止本协议：
        （一）一方严重违反本协议，且对于可补救的违约，未在收到对方书面通知后三十（30）天内予以补救；
        （二）一方严重违约致使不能实现合同目的；
        （三）一方破产、无力偿债、进入清算或解散程序、不再从事业务或不能清偿到期债务；
        （四）按本协议第9.1条之约定，不可抗力事件发生并持续超过九十（90）天。
      </div>
    </div>
    <div class="alert-modal-footer alert-agreement-modal-footer"></div>
  </Modal>
</template>

<script>
import Vue from 'vue';
import { Modal } from 'iview';

Vue.component('Modal', Modal);

const siteName = window.siteName;
const companyName = window.companyName;

export default {
  props: ['width'],
  data() {
    return {
      modalVisible: false,
      siteName,
      companyName,
    };
  },
  methods: {
    show() {
      this.modalVisible = true;
    },
    onClose() {
      this.modalVisible = false;
    },
    onVisibleChange(visible) {
      if (!visible) {
        this.$emit('cancel');
      }
    },
  },
};
</script>

<style>
.alert-agreement-modal-header {
  padding: 20px;
}

.ivu-modal-mask {
  background-color: hsla(0, 0%, 100%, 0.8);
}

.agreement-heading {
  font-weight: 700;
  color: #000;
  font-size: 18px;
  padding-top: 0;
  text-align: center;
  margin-bottom: 30px;
}

.alert-agreement-modal-body {
  display: block;
}

.ivu-modal-header {
  padding: 0;
  border-bottom: none;
}

.ivu-modal-body {
  padding: 0;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-center-modal .ivu-modal {
  top: 0;
}

.ivu-modal-content {
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.agreement-content {
  height: 420px;
  font-size: 14px;
  overflow-y: auto;
  white-space: pre-line;
}

.agreement-content::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

.agreement-content::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

.alert-agreement-modal-footer {
  padding: 0;
  height: 30px;
}
</style>


