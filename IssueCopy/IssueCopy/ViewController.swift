//
//  ViewController.swift
//  IssueCopy
//
//  Created by Patrick Steiner on 13.06.18.
//  Copyright © 2018 Patrick Steiner. All rights reserved.
//

import Cocoa
import SafariServices

class ViewController: NSViewController {

    @IBOutlet weak var enableSafariExtensionButton: NSButton!
    @IBOutlet weak var visitWebsiteButton: NSButton!

    private let extenstionIdentifier = "at.helmsdeep.IssueCopy.IssueCopyExtension"

    override var representedObject: Any? {
        didSet {
            // Update the view, if already loaded.
        }
    }

    // MARK: Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()

        setupUI()
    }

    override func viewWillAppear() {
        super.viewWillAppear()

        checkExtensionState()

        Timer.scheduledTimer(timeInterval: 1,
                             target: self,
                             selector: #selector(checkExtensionState),
                             userInfo: nil,
                             repeats: true)
    }

    // MARK: Data source

    @objc func checkExtensionState() {
        guard SFSafariServicesAvailable() else { return }

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extenstionIdentifier) { (state, error) in
            DispatchQueue.main.async {
                if let state = state, error == nil {
                    self.setUIWithState(enabled: state.isEnabled)
                } else {
                    self.setUIWithState(enabled: false)
                }
            }
        }
    }

    // MARK: UI

    private func setupUI() {
        enableSafariExtensionButton.isHidden = true

        checkExtensionState()
    }

    private func setUIWithState(enabled: Bool) {
        enableSafariExtensionButton.isHidden = enabled
    }

    private func presentWebsite() {
        guard let url = URL(string: AppConstants.websiteURL) else { return }

        NSWorkspace.shared.open(url)
    }

    @IBAction func didPressWebsiteButton(_ sender: NSButton) {
        presentWebsite()
    }

    @IBAction func didPressSafariExtensionButton(_ sender: NSButton) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: extenstionIdentifier)
    }
}
