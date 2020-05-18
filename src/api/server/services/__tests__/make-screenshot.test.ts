import { makeScreenshot } from '../make-screenshot';
import { spyOnExecuteAction, spyOnGetConfig, defaultConfigs } from '../mocks';

describe('makeScreenshot', () => {
  beforeEach(() => {
    spyOnGetConfig.mockClear();
    spyOnExecuteAction.mockClear();
  });

  it('should throw if no page returned', async () => {
    spyOnGetConfig.mockImplementationOnce(() => {
      return defaultConfigs({
        getPage: async () => {
          return new Promise((resolve) => {
            resolve();
          });
        },
      });
    });

    await expect(
      makeScreenshot(
        { browserType: 'chromium', storyId: 'story-id' },
        'localhost',
      ),
    ).rejects.toThrowError(
      'Make sure to return an instance of a page from getPage.',
    );
  });

  it('should make screenshot', async () => {
    const screenshot = await makeScreenshot(
      { browserType: 'chromium', storyId: 'story-id' },
      'localhost',
    );
    expect(screenshot.buffer).toBeDefined();
  });

  it('should convert to base64', async () => {
    const screenshot = await makeScreenshot(
      { browserType: 'chromium', storyId: 'story-id' },
      'localhost',
      true,
    );
    expect(screenshot.base64).toBe(
      'iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAjVBMVEX///+8AC27ACq6ACC6ACK7ACe6AB65ABu+AC+8ACi7ACX88/W3AAC4ABP77/K5ABf23eTy0NfwytLrwcjimqnXdInLVmjFQFTBI0G/CTTtvcjclKC4AA756OzPU23XeYvEMUvKSWHTaX6/FDjosLvZgZHFNE/z1dzlqLTQYHXKQV7orLrWfIrPVm/nvMFRtU1mAAADfElEQVR4nO3d2XaqMBSA4TIoCg5QWwe0CnXo7Ps/3pFlPe1ptus4ELJC/+/KS7JX2NnEDDc3AAAAAAAAAAAAAAAAAABgJ4qT28Fgu90OBrdJHJl+HMOiXnJ3PxyNJ622H/QDv92ajEfD+7uk90sjE6XT4WQWeGHbdV1nb/erHXrBbDKcpr8uLA/beb/ZDA+x+MkNm83+fPtg+jErlCyyZngkHF/CZrZITD9qRdJ85h3rID+6izfLU9OPq1+UZv7/u8i3zuJndc8saR40zohIoRHUuq/Ej51z+sjfvtJ5jE0/uibRdOldEJGCt5zW8gV6mHdPy6wStzuv4cC88v2LI1Lw/ZXpJpQsWvuXd5LPruKva/X+RHlwZUQKQV6joMTZpcn1X15Wm/En2VyXSr74m5oU+0/hJUWJLAyfTDenDMmkXVpIHKc9qUFPibPyekkhtD+n9MZl5ZIDf9wz3ajr9ObljDjfeXO7g7Iooy75KViYbtY1nnWEZBeUZ9MNu1zsXFvQy1zH2jwb5WXn1wPf2ip/3dcUEsfpr0037jJxQ8+bU3Abdr49L7renIL/Yrp5l1h1NYbEcboWTjH1NudO0J+nsbGvcntuag2J4zTtK1Ja+hLsntsy3cRzac4mBdsySjTSm00KjZFdhdtAX7n2pT8w3cyzaK1NDuyqUeKl7gxbcJc2FbPaB+I9q4bj13LnYI8JX0039HS9TiUhcZyOPbXsWxWjTqH/ZrqpJ3svf2Ja5r2bbuqpern+gm2vkdvy8sTav3UO3JYto3Gq/1vnoGvL8r91Velkl1BsmZf9qKY6KYQfpht7oqyqdLJLKJnpxp4mquRj5zMmSzvmC5LKhp1i4LFjOUpa5hqc/2nbMfCk1aXYXZK1IyarKuaTDixZSbyqrjzZFSh2xKSiCaU9S6aVNC3EkVmyPId+oiKfqBh3VNQnKupYFd87Kr6LBcyfqJhnUzEfq2LeXsX/Oyr+BxTwf7GKdQUq1p8IWKekYj2binWPAtbHqlhHrWK9vYB9GQL276jY56ViP6CAfaMC9her2Icu4LwCFedaCDj/RMA5OQLOU1Jx7paA89kEnOMn4LxHAeeCCjg/VsA5wwLOoxZwbrmE8+0F3IMg4L4MCfeqSLh/R8A9TSLu85Jw75uE+wFF3CMp4r7RY7iXFgAAAAAAAAAAAAAAAAAAwR/RclUOQfVgeQAAAABJRU5ErkJggg==',
    );
  });

  it('should execute actions', async () => {
    await makeScreenshot(
      {
        actions: [
          {
            id: 'action-id',
            name: 'action-name',
          },
        ],
        browserType: 'chromium',
        storyId: 'story-id',
      },
      'localhost',
      true,
    );
    expect(spyOnExecuteAction).toBeCalledTimes(1);
  });

  it('should call beforeSnapshotMock', async () => {
    const beforeSnapshotMock = jest.fn();

    spyOnGetConfig.mockImplementationOnce(() => {
      return defaultConfigs({
        beforeSnapshot: beforeSnapshotMock,
      });
    });

    await makeScreenshot(
      {
        browserType: 'chromium',
        storyId: 'story-id',
      },
      'localhost',
      true,
    );
    expect(beforeSnapshotMock).toBeCalledTimes(1);
  });

  it('should call afterSnapshot', async () => {
    const afterSnapshotMock = jest.fn();
    spyOnGetConfig.mockImplementationOnce(() => {
      return defaultConfigs({
        afterSnapshot: afterSnapshotMock,
      });
    });

    await makeScreenshot(
      {
        browserType: 'chromium',
        storyId: 'story-id',
      },
      'localhost',
      true,
    );
    expect(afterSnapshotMock).toBeCalledTimes(1);
  });
});
