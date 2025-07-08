// Dependencies
import sdk from "@farcaster/frame-sdk";

// Components
import Typography from "@/shared/components/Typography";
import AIAgent from "@/shared/components/AIAgent";

// StyleSheet
import styles from "./HomePageRunner.module.scss";

const HomePageRunner = () => {
  return (
    <div className={styles.container}>
      <div
        onClick={() => {
          sdk.actions.swapToken({
            sellToken: "eip155:10/native",
            /**
             * CAIP-19 token ID. For example, OP ETH:
             * eip155:10/native
             */
            buyToken:
              "eip8453:10/erc20:0x18b6f6049A0af4Ed2BBe0090319174EeeF89f53a",
            /**
             * Sell token amount, as numeric string.
             * For example, 1 USDC: 1000000
             */
            sellAmount: "10000000",
          });
        }}
        className={styles.titleSection}
      >
        <Typography
          variant="gta"
          weight="wide"
          size={44}
          lineHeight={36}
          className={styles.mainTitle}
        >
          $RUNNER
        </Typography>
        <Typography
          variant="geist"
          weight="regular"
          size={14}
          lineHeight={18}
          className={styles.subtitle}
        >
          Running Coach & Training Companion
        </Typography>
      </div>

      <div className={styles.runnerGif}>
        <img src={"/runner.gif"} alt="Runner GIF" />
      </div>

      <AIAgent
        message="Hey mfer! Ready to crush your goals? 🏃‍♂️"
        button1Text="Hell yeah!"
        button2Text="Not now"
        onButton1Click={() => {
          console.log("User clicked: Hell yeah!");
        }}
        onButton2Click={() => {
          console.log("User clicked: Not now");
        }}
      />
    </div>
  );
};

export default HomePageRunner;
